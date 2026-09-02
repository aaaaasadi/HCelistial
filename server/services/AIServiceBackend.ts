import { JourneyService } from './JourneyService';
import { AIConversationRepository } from '../repositories/AIConversationRepository';
import { MockAIService } from '../../src/services/mockAIService';
import { FactExtractor } from '../../src/services/ai/FactExtractor';
import { AITravelContext, AIResponse } from '../../src/types';

export class AIServiceBackend {
  private static ai = new MockAIService();

  public static async askAI(tripId: string, question: string): Promise<AIResponse> {
    const bundle = await JourneyService.getJourneyBundle(tripId);

    // Build verified facts directly from persisted state
    const verifiedFacts = FactExtractor.extractFacts({
      trip: bundle.trip,
      connections: bundle.connections,
      disruptions: bundle.disruptions,
      impacts: bundle.impacts,
      recoveryPlans: bundle.recoveryPlans
    });

    const aiContext: AITravelContext = {
      traveler: { name: 'Arjun Mehta', id: 'TRV-88219', loyaltyTier: 'Gold Priority' },
      tripTitle: bundle.trip.title,
      trip: bundle.trip,
      currentSegment: bundle.segments[0],
      segments: bundle.segments,
      transportStatuses: bundle.segments.map((s) => ({
        segmentId: s.id,
        status: s.status,
        delayMinutes: s.delayMinutes,
        estimatedArrival: s.estimatedArrival
      })),
      connections: bundle.connections,
      disruptions: bundle.disruptions,
      impacts: bundle.impacts,
      recoveryPlans: bundle.recoveryPlans,
      recommendedPlan: bundle.recommendedPlan,
      userPreferences: bundle.userPreferences,
      journeyHealth: bundle.journeyHealth,
      journeyStatus: bundle.journeyStatus,
      verifiedFacts
    };

    const conversationId = await AIConversationRepository.getOrCreateConversation('TRV-88219', tripId);

    // Record user message
    await AIConversationRepository.addMessage(conversationId, 'user', question);

    // Generate AI response
    const response = await this.ai.generateResponse(aiContext, question);

    // Record assistant message
    await AIConversationRepository.addMessage(
      conversationId,
      'assistant',
      response.message,
      response.actions
    );

    return response;
  }
}

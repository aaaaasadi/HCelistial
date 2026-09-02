import {
  AITravelContext,
  AIConversationState,
  AIResponse,
  AIAction,
  RecoveryPlan,
  ChatMessageData,
  IAIService
} from '../types';
import { AIGuardrails } from './ai/AIGuardrails';
import { AIPreferenceParser } from './ai/AIPreferenceParser';

export class MockAIService implements IAIService {
  /**
   * Generates a context-aware initial greeting message tailored to the current journey state.
   */
  public static getInitialMessages(context: AITravelContext): ChatMessageData[] {
    const { journeyStatus, connections, recoveryPlans, recommendedPlan } = context;

    if (journeyStatus === 'RECOVERED') {
      const confirmedTitle = recommendedPlan?.title || 'Train + Bus Seamless Connector';
      return [
        {
          id: 'msg-init-rec',
          sender: 'ai',
          text: `Great news, ${context.traveler.name}! Your journey has been successfully reconstructed around "${confirmedTitle}". Your new connection buffer is safe and your Casa Ocean Retreat booking is preserved.`,
          timestamp: 'Just now',
          facts: context.verifiedFacts.slice(0, 3),
          confidence: 0.98,
          dataSource: 'VERIFIED_FACTS',
          actions: [
            {
              type: 'VIEW_JOURNEY',
              label: 'View Recovered Timeline',
              actionTab: 'journey'
            }
          ]
        }
      ];
    } else if (journeyStatus === 'DISRUPTED') {
      const topScore = recommendedPlan?.recoveryScore || 92;
      return [
        {
          id: 'msg-init-disrupt',
          sender: 'ai',
          text: `🚨 Disruption Detected: Your feeder train delay (+3h 20m) eliminates the transfer window in Pune. Our Recovery Engine evaluated all options and found ${recoveryPlans.length} feasible alternatives. The top recommendation (${recommendedPlan?.title || 'Train + Bus'}) restores your journey with a ${topScore}% score.`,
          timestamp: 'Just now',
          structuredBreakdown: {
            answer: 'Feeder train delay broke downstream bus connection in Pune.',
            why: 'Expected arrival 4:50 PM leaves insufficient buffer before 5:00 PM bus departure.',
            options: `${recoveryPlans.length} verified recovery plans ready.`,
            recommendation: recommendedPlan?.title || 'Train + Bus Seamless Connector',
            tradeoffs: recommendedPlan?.tradeoffs.disadvantages[0] || 'Minor contingency fare'
          },
          facts: context.verifiedFacts.filter((f) => f.type === 'TRAIN_DELAY' || f.type === 'CONNECTION_STATUS'),
          confidence: 0.95,
          dataSource: 'DEMO_ENGINE',
          referencedPlanId: recommendedPlan?.id,
          actions: [
            {
              type: 'VIEW_RECOVERY',
              label: 'Open Recovery Center',
              actionTab: 'recovery'
            },
            {
              type: 'COMPARE_PLANS',
              label: 'Compare 3 Options',
              actionTab: 'recovery'
            }
          ]
        }
      ];
    } else if (journeyStatus === 'AT_RISK') {
      const primaryConn = connections[0];
      const bufferMins = primaryConn?.availableBufferMinutes || 165;
      const hours = Math.floor(bufferMins / 60);
      const mins = bufferMins % 60;
      const bufferStr = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim() : `${mins}m`;

      return [
        {
          id: 'msg-init-risk',
          sender: 'ai',
          text: `Notice: A 45-minute delay on Express 12127 has tightened your connection window at Pune Swargate to ${bufferStr}. The connection is still feasible, but buffer is tight.`,
          timestamp: 'Just now',
          facts: context.verifiedFacts.filter((f) => f.type === 'DELAY' || f.type === 'CONNECTION_BUFFER'),
          confidence: 0.92,
          dataSource: 'VERIFIED_FACTS',
          actions: [
            {
              type: 'VIEW_JOURNEY',
              label: 'Inspect Journey Timeline',
              actionTab: 'journey'
            }
          ]
        }
      ];
    } else {
      return [
        {
          id: 'msg-init-normal',
          sender: 'ai',
          text: `Hello ${context.traveler.name}! I am your TravelRescue AI Guide. I am actively monitoring your Mumbai → Pune → Goa journey. All connections have comfortable transfer buffers and all downstream bookings are secure.`,
          timestamp: 'Just now',
          facts: context.verifiedFacts.slice(0, 2),
          confidence: 0.99,
          dataSource: 'VERIFIED_FACTS',
          actions: [
            {
              type: 'VIEW_JOURNEY',
              label: 'View Schedule',
              actionTab: 'journey'
            }
          ]
        }
      ];
    }
  }

  /**
   * Main question answering engine implementing IAIService.
   */
  public async generateResponse(
    context: AITravelContext,
    question: string,
    state?: AIConversationState
  ): Promise<AIResponse> {
    // Brief realistic thinking latency
    await new Promise((res) => setTimeout(res, 350));

    const q = question.toLowerCase().trim();
    const { journeyStatus, connections, userPreferences, impacts, recoveryPlans, recommendedPlan, segments } = context;
    const primaryConn = connections[0];
    const affectedSegment = segments.find(
      (s) => s.type !== 'HOTEL' && s.type !== 'ACTIVITY' && ((s as any).status === 'MISSED' || (s as any).isDisrupted)
    );

    let message = '';
    let structuredBreakdown: AIResponse['structuredBreakdown'];
    let referencedPlanId: string | undefined;
    let referencedSegmentId: string | undefined = affectedSegment?.id;
    let actions: AIAction[] = [];
    let confidence = 0.94;

    // Check for natural language preference updates first
    const prefResult = AIPreferenceParser.parse(question);
    if (prefResult.hasPreferenceUpdate) {
      message = `I have noted your preference update: ${prefResult.explanation}. I've instructed the Recovery Engine to re-evaluate feasible options according to these parameters.`;
      actions.push({
        type: 'UPDATE_PREFERENCE',
        label: 'Apply Preference & Recalculate',
        preferenceUpdate: prefResult.updates,
        actionTab: 'recovery'
      });
      actions.push({
        type: 'VIEW_RECOVERY',
        label: 'View Re-Ranked Options',
        actionTab: 'recovery'
      });

      return AIGuardrails.validateResponse(
        {
          id: `res-${Date.now()}`,
          message,
          actions,
          facts: context.verifiedFacts.slice(0, 2),
          confidence: 0.96,
          dataSource: 'DEMO_ENGINE'
        },
        context
      );
    }

    // 1. "What happened?" / "What's happening with my journey?"
    if (q.includes('what happened') || q.includes('what is happening') || q.includes("what's happening")) {
      if (journeyStatus === 'DISRUPTED') {
        message =
          'Your Mumbai → Pune train (Express 12127) is delayed by 3 hours 20 minutes due to a traction motor failure. Your expected arrival is pushed to 4:50 PM, meaning your 5:00 PM Pune → Goa bus cannot be reached. Your hotel check-in at Casa Ocean Retreat is also at risk.';
        structuredBreakdown = {
          answer: 'Feeder train delayed +3h 20m; connection to Pune → Goa bus is missed.',
          why: 'Arrival at 4:50 PM leaves only 10m (30m required to reach Swargate).',
          options: `${recoveryPlans.length} feasible recovery alternatives identified.`,
          recommendation: recommendedPlan?.title || 'Train + Bus Connector',
          tradeoffs: 'Requires platform transfer in Pune.'
        };
        actions = [
          { type: 'VIEW_IMPACT', label: 'View Impact Cascade', actionTab: 'recovery' },
          { type: 'VIEW_RECOVERY', label: 'View Recovery Options', actionTab: 'recovery' }
        ];
      } else if (journeyStatus === 'AT_RISK') {
        message =
          'Train 12127 is delayed by 45 minutes, arriving Pune at 2:15 PM instead of 1:30 PM. Your available buffer for the 5:00 PM bus is now 2 hours 45 minutes. The journey is currently classified as At Risk, but the connection remains feasible.';
        actions = [{ type: 'VIEW_JOURNEY', label: 'View Timeline', actionTab: 'journey' }];
      } else if (journeyStatus === 'RECOVERED') {
        message =
          'Your journey was previously disrupted, but has now been successfully recovered. You are confirmed on a new connector arriving in Goa tonight with hotel bookings intact.';
        actions = [{ type: 'VIEW_JOURNEY', label: 'View Recovered Route', actionTab: 'journey' }];
      } else {
        message =
          'Everything is operating on schedule! Your feeder train departs Mumbai CSMT on time, and you have a comfortable 3h 30m transfer buffer in Pune.';
        actions = [{ type: 'VIEW_JOURNEY', label: 'View Schedule', actionTab: 'journey' }];
      }
    }
    // 2. "Will I make my connection?" / "Connection feasibility"
    else if (q.includes('make my connection') || q.includes('will i make') || q.includes('connection')) {
      if (!primaryConn) {
        message = "I don't have verified information for an active connection on your current route.";
      } else if (primaryConn.status === 'RECOVERED') {
        message = `Yes! Your recovered connection is confirmed. You arrive at ${primaryConn.arrivalTime} and depart at ${primaryConn.departureTime}, giving you a safe transfer buffer of ${primaryConn.availableBufferMinutes} minutes at ${primaryConn.transferStation}.`;
        actions = [{ type: 'VIEW_JOURNEY', label: 'View Connection in Timeline', actionTab: 'journey' }];
      } else if (primaryConn.status === 'MISSED') {
        message = `No. Your expected train arrival is 4:50 PM, but your bus departs at 5:00 PM. A minimum of ${primaryConn.requiredTransferMinutes} minutes is required to reach Swargate. The connection buffer is -10 minutes, so this bus cannot be reached.`;
        structuredBreakdown = {
          answer: 'No, this connection is physically impossible to make.',
          why: 'Train arrives at 4:50 PM; bus departs at 5:00 PM across town.',
          options: `${recoveryPlans.length} alternative connector plans found.`,
          recommendation: recommendedPlan?.title || 'Option 1'
        };
        actions = [
          { type: 'VIEW_RECOVERY', label: 'Review Recovery Plans', actionTab: 'recovery' }
        ];
      } else if (primaryConn.status === 'AT_RISK' || primaryConn.riskLevel === 'CRITICAL') {
        message = `Your connection is at critical risk. Your buffer is only ${primaryConn.availableBufferMinutes} minutes (requires ${primaryConn.requiredTransferMinutes} minutes minimum).`;
        actions = [{ type: 'VIEW_RECOVERY', label: 'Analyze Recovery Plans', actionTab: 'recovery' }];
      } else {
        const hours = Math.floor(primaryConn.availableBufferMinutes / 60);
        const mins = primaryConn.availableBufferMinutes % 60;
        const bufferStr = hours > 0 ? `${hours} hours and ${mins} minutes` : `${mins} minutes`;
        message = `Yes. Your current connection buffer is ${bufferStr} (arrival ${primaryConn.arrivalTime}, next departure ${primaryConn.departureTime}), which comfortably exceeds the ${primaryConn.requiredTransferMinutes}-minute required transfer time.`;
        actions = [{ type: 'VIEW_JOURNEY', label: 'View Connection', actionTab: 'journey' }];
      }
    }
    // 3. "What's my best recovery option?" / "Which is best?" / "What are my options?"
    else if (q.includes('best') || q.includes('which is best') || q.includes('what are my options') || q.includes('options') || q.includes('what can i do') || q.includes('what should i do')) {
      if (journeyStatus !== 'DISRUPTED' && journeyStatus !== 'RECOVERED') {
        message =
          'Your journey is currently on track, so no recovery options are required. If a disruption occurs, I will immediately present verified alternative options.';
        actions = [{ type: 'VIEW_JOURNEY', label: 'View Itinerary', actionTab: 'journey' }];
      } else if (recommendedPlan) {
        referencedPlanId = recommendedPlan.id;
        message = `I recommend ${recommendedPlan.title} (${recommendedPlan.recoveryScore}% Recovery Score). It arrives in Goa at ${recommendedPlan.newArrival}, preserves your Casa Ocean Retreat hotel booking, requires only ${recommendedPlan.transfersCount} transfer, and costs ₹${recommendedPlan.totalCost} (+₹${recommendedPlan.additionalCost} additional fare).`;
        structuredBreakdown = {
          answer: `Recommended plan: ${recommendedPlan.title}`,
          why: 'Preserves hotel without penalty, safe transfer buffer, high confidence.',
          options: `${recoveryPlans.length} verified alternatives evaluated.`,
          recommendation: recommendedPlan.title,
          tradeoffs: recommendedPlan.tradeoffs.disadvantages[0] || 'Minor additional cost'
        };
        actions = [
          {
            type: 'SELECT_PLAN',
            label: `Select ${recommendedPlan.title.split(' ')[0]} Plan`,
            planId: recommendedPlan.id,
            actionTab: 'recovery'
          },
          {
            type: 'COMPARE_PLANS',
            label: 'Compare All Plans',
            actionTab: 'recovery'
          }
        ];
      } else {
        message = 'Based on current demo data, no feasible recovery plans satisfy your active preferences and budget ceiling.';
        actions = [
          {
            type: 'UPDATE_PREFERENCE',
            label: 'Relax Budget to ₹3,000',
            preferenceUpdate: { maxAdditionalBudget: 3000 },
            actionTab: 'recovery'
          }
        ];
      }
    }
    // 4. "Why do you recommend this option?" / "Why?"
    else if (q.includes('why do you recommend') || q.includes('why this') || q === 'why' || q === 'why?') {
      if (recommendedPlan) {
        referencedPlanId = recommendedPlan.id;
        message = `I recommend ${recommendedPlan.title} for five verified reasons:\n` +
          `• Recovery Score: ${recommendedPlan.recoveryScore}%\n` +
          `• Hotel Booking: ${recommendedPlan.hotelStatus === 'PRESERVED' ? 'Preserved without penalty' : 'Late check-in notification sent'}\n` +
          `• Arrival: Reaches Goa at ${recommendedPlan.newArrival}\n` +
          `• Transfers: Only ${recommendedPlan.transfersCount} seamless platform-adjacent transfer in Pune\n` +
          `• Budget: Total fare ₹${recommendedPlan.totalCost} (+₹${recommendedPlan.additionalCost}) is well within your ₹${userPreferences.maxAdditionalBudget} limit.`;
        structuredBreakdown = {
          answer: `${recommendedPlan.title} is mathematically ranked #1.`,
          why: recommendedPlan.tradeoffs.advantages.slice(0, 3).join('; '),
          tradeoffs: recommendedPlan.tradeoffs.disadvantages[0] || 'None'
        };
        actions = [
          {
            type: 'SELECT_PLAN',
            label: 'Confirm this Recommendation',
            planId: recommendedPlan.id,
            actionTab: 'recovery'
          }
        ];
      } else {
        message = "I don't have an active recovery recommendation because your journey is operating on schedule.";
      }
    }
    // 5. "What's the cheapest option?"
    else if (q.includes('cheapest') || q.includes('lowest cost') || q.includes('least expensive')) {
      if (recoveryPlans.length > 0) {
        const cheapest = [...recoveryPlans].sort((a, b) => a.totalCost - b.totalCost)[0];
        referencedPlanId = cheapest.id;
        message = `The cheapest option is "${cheapest.title}" for ₹${cheapest.totalCost} (+₹${cheapest.additionalCost} additional). It arrives in Goa at ${cheapest.newArrival} with ${cheapest.transfersCount} transfer(s).`;
        structuredBreakdown = {
          answer: `Cheapest: ${cheapest.title} (₹${cheapest.totalCost})`,
          why: `Only +₹${cheapest.additionalCost} above original journey cost.`,
          tradeoffs: cheapest.tradeoffs.disadvantages.join('; ')
        };
        actions = [
          {
            type: 'SELECT_PLAN',
            label: `Select ${cheapest.title.split(' ')[0]}`,
            planId: cheapest.id,
            actionTab: 'recovery'
          },
          {
            type: 'VIEW_RECOVERY',
            label: 'View in Recovery Center',
            actionTab: 'recovery'
          }
        ];
      } else {
        message = 'Your original scheduled journey cost of ₹900 remains the lowest baseline.';
      }
    }
    // 6. "What's the fastest option?"
    else if (q.includes('fastest') || q.includes('quickest') || q.includes('earliest arrival')) {
      if (recoveryPlans.length > 0) {
        const fastest = recoveryPlans.find((p) => p.tag === 'FASTEST') || recoveryPlans[0];
        referencedPlanId = fastest.id;
        message = `The fastest option is "${fastest.title}", arriving in Goa at ${fastest.newArrival}. Total cost is ₹${fastest.totalCost} (+₹${fastest.additionalCost} additional).`;
        actions = [
          {
            type: 'SELECT_PLAN',
            label: `Select ${fastest.title.split(' ')[0]}`,
            planId: fastest.id,
            actionTab: 'recovery'
          }
        ];
      } else {
        message = 'Your scheduled itinerary arrives in Goa at 11:00 PM tonight.';
      }
    }
    // 7. "Can I avoid flights?" / "Flight avoidance"
    else if (q.includes('avoid flight') || q.includes('flight') || q.includes('fly')) {
      const groundPlans = recoveryPlans.filter((p) => p.type === 'GROUND');
      if (groundPlans.length > 0) {
        message = `Yes! We found ${groundPlans.length} verified ground-transit recovery plans that completely avoid flights, including the top-rated "${groundPlans[0].title}". You can also permanently enforce ground-only transit in your Preferences tab.`;
        actions = [
          {
            type: 'UPDATE_PREFERENCE',
            label: 'Enforce "Avoid Flights" in Preferences',
            preferenceUpdate: { avoidFlights: true },
            actionTab: 'recovery'
          },
          {
            type: 'VIEW_RECOVERY',
            label: 'View Ground Plans',
            actionTab: 'recovery'
          }
        ];
      } else {
        message = 'You can toggle "Avoid Flights" in Preferences at any time to guarantee that all contingency options use rail or road transit.';
        actions = [{ type: 'VIEW_RECOVERY', label: 'Check Preferences', actionTab: 'preferences' }];
      }
    }
    // 8. "How much extra will I pay?"
    else if (q.includes('how much extra') || q.includes('extra') || q.includes('pay') || q.includes('additional cost')) {
      if (recommendedPlan) {
        message = `For the recommended ${recommendedPlan.title}, you will pay an additional fare of ₹${recommendedPlan.additionalCost} (total fare ₹${recommendedPlan.totalCost}). This is well within your ₹${userPreferences.maxAdditionalBudget} budget ceiling.`;
        actions = [
          {
            type: 'SELECT_PLAN',
            label: `Confirm +₹${recommendedPlan.additionalCost} Option`,
            planId: recommendedPlan.id,
            actionTab: 'recovery'
          }
        ];
      } else {
        message = 'Zero additional cost is required as your itinerary is running on schedule.';
      }
    }
    // 9. "What happens to my hotel?"
    else if (q.includes('hotel') || q.includes('check-in') || q.includes('check in') || q.includes('casa ocean')) {
      if (journeyStatus === 'DISRUPTED') {
        message =
          'Your check-in at Casa Ocean Retreat is scheduled for 11:00 PM. If you accept the recommended Train + Bus Connector (arriving 11:40 PM), your reservation is fully preserved without penalty. For late-night arrivals (Option 2), TravelRescue automatically dispatches a verified late check-in notification to hold your suite.';
        actions = [{ type: 'VIEW_IMPACT', label: 'Inspect Hotel Booking Impact', actionTab: 'recovery' }];
      } else if (journeyStatus === 'RECOVERED') {
        message =
          'Your reservation at Casa Ocean Retreat & Spa is fully preserved and guaranteed under your recovery plan.';
      } else {
        message =
          'Your check-in at Casa Ocean Retreat & Spa is confirmed for 11:00 PM today. Everything is on schedule.';
      }
    }
    // 10. "What happens to my activity?" / "Scuba dive"
    else if (q.includes('activity') || q.includes('scuba') || q.includes('excursion')) {
      if (journeyStatus === 'DISRUPTED') {
        message =
          "Your Grand Island Scuba Excursion is scheduled for 9:00 AM tomorrow. Recovery Option 1 gets you to Goa before midnight, ensuring you have ample rest to participate. Later arrivals past 4:00 AM may cause fatigue and put the excursion at risk.";
        actions = [{ type: 'VIEW_IMPACT', label: 'View Activity Impact', actionTab: 'recovery' }];
      } else {
        message =
          'Your Grand Island Scuba Diving reservation is confirmed for 9:00 AM tomorrow. Everything is proceeding as planned.';
      }
    }
    // 11. "Compare the options" / "Compare plans"
    else if (q.includes('compare') || q.includes('comparison')) {
      if (recoveryPlans.length >= 2) {
        const p1 = recoveryPlans[0];
        const p2 = recoveryPlans[1];
        const p3 = recoveryPlans[2];
        message =
          `Here is the verified comparison of your top recovery plans:\n\n` +
          `• ${p1.title} (${p1.recoveryScore}% Score): Arrives ${p1.newArrival}, Total ₹${p1.totalCost} (+₹${p1.additionalCost}), ${p1.transfersCount} transfer. Hotel preserved.\n` +
          `• ${p2.title} (${p2.recoveryScore}% Score): Arrives ${p2.newArrival}, Total ₹${p2.totalCost} (+₹${p2.additionalCost}), ${p2.transfersCount} transfer. Late check-in required.\n` +
          (p3 ? `• ${p3.title} (${p3.recoveryScore}% Score): Arrives ${p3.newArrival}, Total ₹${p3.totalCost} (+₹${p3.additionalCost}), ${p3.transfersCount} transfer.` : '');
        structuredBreakdown = {
          answer: 'Comparison of feasible alternatives.',
          why: `${p1.title} balances arrival speed and hotel protection.`,
          options: `${recoveryPlans.length} plans available.`,
          recommendation: p1.title
        };
        actions = [
          { type: 'COMPARE_PLANS', label: 'Open Side-by-Side Comparison', actionTab: 'recovery' },
          { type: 'VIEW_RECOVERY', label: 'View in Recovery Center', actionTab: 'recovery' }
        ];
      } else {
        message = 'Based on current demo data, there is only one feasible option to compare.';
      }
    }
    // 12. "Which option preserves the most of my itinerary?"
    else if (q.includes('preserves') || q.includes('preservation') || q.includes('itinerary preservation')) {
      const topPreserved = [...recoveryPlans].sort((a, b) => b.itineraryPreservation - a.itineraryPreservation)[0];
      if (topPreserved) {
        referencedPlanId = topPreserved.id;
        message = `"${topPreserved.title}" preserves ${topPreserved.itineraryPreservation}% of your itinerary. It protects both your Casa Ocean Retreat booking and tomorrow's scuba dive excursion.`;
        actions = [
          {
            type: 'SELECT_PLAN',
            label: `Select ${topPreserved.title.split(' ')[0]}`,
            planId: topPreserved.id,
            actionTab: 'recovery'
          }
        ];
      } else {
        message = 'Your current schedule preserves 100% of your planned itinerary.';
      }
    }
    // 13. "Is my journey on track?" / "Are there any risks?"
    else if (q.includes('on track') || q.includes('safe') || q.includes('risks') || q.includes('risk')) {
      if (journeyStatus === 'ON_TRACK') {
        message =
          'Yes, your journey is currently on track! Both transport segments are operating on time, and your 3h 30m transfer buffer in Pune exceeds the required 30-minute window.';
        actions = [{ type: 'VIEW_JOURNEY', label: 'View Timeline', actionTab: 'journey' }];
      } else if (journeyStatus === 'AT_RISK') {
        message =
          'Your journey is currently At Risk. A 45-minute delay on your train has reduced your Pune buffer to 2h 45m. The connection is still viable, but buffer is tight.';
        actions = [{ type: 'VIEW_JOURNEY', label: 'Check Buffer in Timeline', actionTab: 'journey' }];
      } else if (journeyStatus === 'RECOVERED') {
        message =
          'Your recovered journey is safe. Your replacement transport is confirmed, and your hotel and scuba dive bookings are secured.';
        actions = [{ type: 'VIEW_JOURNEY', label: 'View Recovered Route', actionTab: 'journey' }];
      } else {
        message =
          'Your journey has experienced a critical disruption. Train 12127 is delayed by 3 hours 20 minutes, breaking your connection in Pune.';
        actions = [{ type: 'VIEW_RECOVERY', label: 'Open Recovery Center', actionTab: 'recovery' }];
      }
    }
    // 14. "What's my next connection?" / "Next segment"
    else if (q.includes('next connection') || q.includes('next segment') || q.includes('next leg')) {
      if (primaryConn) {
        message = `Your next connection is at ${primaryConn.transferStation} between ${primaryConn.arrivingFrom} and ${primaryConn.nextDeparture}. Scheduled transfer buffer is ${primaryConn.availableBufferMinutes} minutes.`;
        actions = [{ type: 'VIEW_JOURNEY', label: 'Inspect Connection', actionTab: 'journey' }];
      } else {
        message = "I don't have verified information for a subsequent connection leg.";
      }
    }
    // 15. Fallback Guardrail
    else {
      message =
        `Based on current demo data for ${context.tripTitle}, your journey health is ${context.journeyHealth}% (${journeyStatus}). ` +
        (journeyStatus === 'DISRUPTED'
          ? `Our Recovery Engine has evaluated ${recoveryPlans.length} contingency plans. Ask me about costs, flight alternatives, or recommendations.`
          : 'All connections are actively monitored.');
      actions = [{ type: 'VIEW_JOURNEY', label: 'View Journey', actionTab: 'journey' }];
    }

    const rawResponse: AIResponse = {
      id: `res-${Date.now()}`,
      message,
      structuredBreakdown,
      referencedPlanId,
      referencedSegmentId,
      actions,
      facts: context.verifiedFacts.slice(0, 3),
      confidence,
      dataSource: 'DEMO_ENGINE'
    };

    return AIGuardrails.validateResponse(rawResponse, context);
  }

  public async generateRecommendation(context: AITravelContext): Promise<AIResponse> {
    return this.generateResponse(context, "What's my best recovery option?");
  }

  public async explainRecoveryPlan(context: AITravelContext, plan: RecoveryPlan): Promise<AIResponse> {
    return this.generateResponse(context, `Why do you recommend ${plan.title}?`);
  }

  public async compareRecoveryPlans(context: AITravelContext, plans: RecoveryPlan[]): Promise<AIResponse> {
    return this.generateResponse(context, 'Compare the recovery options.');
  }

  public async summarizeDisruption(context: AITravelContext): Promise<AIResponse> {
    return this.generateResponse(context, 'What happened?');
  }

  /**
   * Static helper for backward compatibility with existing components
   */
  public static async answerQuestion(
    question: string,
    context: AITravelContext,
    state?: AIConversationState
  ): Promise<ChatMessageData> {
    const service = new MockAIService();
    const response = await service.generateResponse(context, question, state);
    return {
      id: response.id,
      sender: 'ai',
      text: response.message,
      timestamp: 'Just now',
      structuredBreakdown: response.structuredBreakdown,
      actions: response.actions,
      facts: response.facts,
      confidence: response.confidence,
      dataSource: response.dataSource,
      referencedPlanId: response.referencedPlanId,
      referencedSegmentId: response.referencedSegmentId
    };
  }
}

import { UserPreferences } from '../../types';

export interface PreferenceParseResult {
  hasPreferenceUpdate: boolean;
  updates: Partial<UserPreferences>;
  explanation: string;
}

export class AIPreferenceParser {
  /**
   * Parses natural language input for traveler preference changes.
   * Returns a validated structured partial update.
   */
  public static parse(input: string): PreferenceParseResult {
    const text = input.toLowerCase().trim();
    const updates: Partial<UserPreferences> = {};
    const explanations: string[] = [];

    // 1. Budget extraction: e.g. "don't want to spend more than ₹500", "budget 1000", "under 1500"
    const budgetMatch = text.match(/(?:spend|more than|budget|under|ceiling|limit|max(?:imum)?)\s*(?:of|is|to)?\s*(?:₹|rs\.?|inr)?\s*(\d+)/i) ||
                        text.match(/(?:₹|rs\.?|inr)\s*(\d+)/i);
    if (budgetMatch) {
      const budgetVal = parseInt(budgetMatch[1], 10);
      if (!isNaN(budgetVal) && budgetVal >= 0 && budgetVal <= 50000) {
        updates.maxAdditionalBudget = budgetVal;
        explanations.push(`Set contingency budget limit to ₹${budgetVal.toLocaleString('en-IN')}`);
      }
    }

    // 2. Flight avoidance: e.g. "don't want flights", "avoid flights", "no flying", "ground only"
    if (
      text.includes("don't want flight") ||
      text.includes("dont want flight") ||
      text.includes("avoid flight") ||
      text.includes("no flight") ||
      text.includes("no fly") ||
      text.includes("ground only") ||
      text.includes("by train or bus only")
    ) {
      updates.avoidFlights = true;
      explanations.push('Enforced ground transit only (flights excluded)');
    } else if (text.includes('flights are ok') || text.includes('allow flights') || text.includes('willing to fly')) {
      updates.avoidFlights = false;
      explanations.push('Allowed flight options');
    }

    // 3. Overnight avoidance: e.g. "avoid overnight", "no sleeper", "don't want overnight"
    if (
      text.includes('avoid overnight') ||
      text.includes('no overnight') ||
      text.includes("don't want overnight") ||
      text.includes('no sleeper')
    ) {
      updates.avoidOvernight = true;
      explanations.push('Overnight journeys excluded');
    }

    // 4. Priority shifts: Lowest Cost (only on explicit preference statement, not inquiry)
    const isQuestion = text.startsWith('what') || text.startsWith('which') || text.startsWith('how') || text.includes('?');
    
    if (
      !isQuestion &&
      (text.includes('cost matters more') ||
       text.includes('prioritize cost') ||
       text.includes('lowest cost') ||
       text.includes('prefer cheapest') ||
       text.includes('want cheapest') ||
       text.includes('save money') ||
       text.includes('cheaper option please'))
    ) {
      updates.primaryPriority = 'LOWEST_COST';
      explanations.push('Prioritizing lowest contingency fare');
    }

    // 5. Priority shifts: Fastest Arrival (only on explicit preference statement, not inquiry)
    if (
      !isQuestion &&
      (text.includes('reach earliest') ||
       text.includes('speed is priority') ||
       text.includes('prioritize speed') ||
       text.includes('fastest arrival') ||
       text.includes('want fastest') ||
       text.includes('prefer fastest'))
    ) {
      updates.primaryPriority = 'FASTEST_ARRIVAL';
      explanations.push('Prioritizing fastest arrival time');
    }

    // 6. Priority shifts: Fewer Transfers
    if (
      !isQuestion &&
      (text.includes('fewer transfer') ||
       text.includes('less transfer') ||
      text.includes('least transfer') ||
      text.includes('direct only') ||
      text.includes('no transfers'))
    ) {
      updates.primaryPriority = 'FEWER_TRANSFERS';
      explanations.push('Prioritizing minimal transfers');
    }

    // 7. Priority shifts: Preserve Bookings
    if (
      text.includes('preserve booking') ||
      text.includes('protect hotel') ||
      text.includes('keep hotel')
    ) {
      updates.primaryPriority = 'PRESERVE_BOOKINGS';
      explanations.push('Prioritizing downstream hotel and activity preservation');
    }

    const hasPreferenceUpdate = Object.keys(updates).length > 0;
    return {
      hasPreferenceUpdate,
      updates,
      explanation: explanations.join(', ')
    };
  }
}


import { Email, EmailPriority, Sentiment, EmailCategory, FilterRule, FilterCondition } from '../types';

const SENDERS = ["Alice Wonderland", "Bob The Builder", "Charlie Brown", "Diana Prince", "Edward Scissorhands", "Fiona Apple", "George Jetson", "Jane Doe", "Support Team", "Newsletter Hub", "Promotions Inc."];
const SUBJECT_PREFIXES = ["Regarding", "Update on", "Quick question about", "Action Required:", "FYI:", "Invitation:", "Your order", "Weekly Digest"];
const BODY_SNIPPETS = [
  "Just wanted to follow up on our last conversation. Let me know your thoughts.",
  "Please find attached the report you requested. The key findings are on page 3.",
  "Can we schedule a brief meeting next week to discuss the project proposal? I'm available on Tuesday or Wednesday afternoon.",
  "This is a reminder that your subscription will auto-renew next month. No action is required if you wish to continue.",
  "Exciting news! We've just launched a new feature that we think you'll love. Check it out!",
  "Your recent order #12345 has been shipped and is expected to arrive by Friday. Track your package here: [link]",
  "Don't miss out on our special 20% off sale, ending this weekend! Shop now for the best deals.",
  "This is an automated notification. A new login to your account was detected from a new device.",
  "Thank you for contacting support. We have received your query and a team member will get back to you within 24 hours.",
  "Here's your weekly summary of interesting articles and updates from our community."
];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomDate = (start: Date, end: Date): Date => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const getMockEmails = (count: number): Email[] => {
  const emails: Email[] = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 30); // Emails from the last 30 days

  for (let i = 0; i < count; i++) {
    const sender = getRandomElement(SENDERS);
    const subject = `${getRandomElement(SUBJECT_PREFIXES)} ${sender.split(" ")[0]}'s Project`;
    const body = getRandomElement(BODY_SNIPPETS) + "\n\n" + getRandomElement(BODY_SNIPPETS);
    const timestamp = getRandomDate(startDate, endDate);
    const read = Math.random() > 0.3;
    const priority = getRandomElement(Object.values(EmailPriority));
    // const sentiment = Math.random() > 0.2 ? getRandomElement(Object.values(Sentiment).filter(s => s !== Sentiment.Unknown)) : Sentiment.Unknown;
    let category = EmailCategory.Inbox;
    if (sender.includes("Promotions") || subject.toLowerCase().includes("sale") || subject.toLowerCase().includes("deal")) category = EmailCategory.Promotions;
    else if (sender.includes("Support") || subject.toLowerCase().includes("ticket")) category = EmailCategory.Priority; // Example initial category

    emails.push({
      id: `email_${Date.now()}_${i}`,
      sender,
      senderAvatar: `https://picsum.photos/seed/${sender.replace(/\s+/g, '')}/40/40`,
      recipient: "user@example.com",
      subject,
      body,
      timestamp,
      read,
      priority,
      // sentiment, // Sentiment will be fetched by Gemini on demand
      category,
      tags: Math.random() > 0.7 ? ['important', 'project-x'] : [],
      attachments: Math.random() > 0.8 ? [{ name: 'report.pdf', size: '1.2MB', type: 'application/pdf' }] : [],
    });
  }
  return emails.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const checkCondition = (email: Email, condition: FilterCondition): boolean => {
  const value = String(condition.value).toLowerCase();
  let emailFieldValue: string;

  switch (condition.field) {
    case 'sender':
      emailFieldValue = email.sender.toLowerCase();
      break;
    case 'subject':
      emailFieldValue = email.subject.toLowerCase();
      break;
    case 'body':
      emailFieldValue = email.body.toLowerCase();
      break;
    case 'sentiment':
      emailFieldValue = (email.sentiment || Sentiment.Unknown).toLowerCase();
      // For 'is'/'isNot' with enums
      if (condition.operator === 'is') return emailFieldValue === value;
      if (condition.operator === 'isNot') return emailFieldValue !== value;
      return false; // Other operators not typical for enum matching like this
    case 'priorityScore': // Simplified: treats EmailPriority as a "score"
      emailFieldValue = email.priority.toLowerCase();
      if (condition.operator === 'is') return emailFieldValue === value;
      if (condition.operator === 'isNot') return emailFieldValue !== value;
      return false;
    default:
      return false;
  }
  
  // Common string operators
  switch (condition.operator) {
    case 'contains':
      return emailFieldValue.includes(value);
    case 'notContains':
      return !emailFieldValue.includes(value);
    case 'equals':
      return emailFieldValue === value;
    case 'startsWith':
      return emailFieldValue.startsWith(value);
    case 'endsWith':
      return emailFieldValue.endsWith(value);
    case 'matchesRegex':
      try {
        return new RegExp(condition.value as string, 'i').test(emailFieldValue);
      } catch (e) {
        console.error("Invalid regex in filter:", condition.value);
        return false;
      }
    default:
      return false;
  }
};

export const applyFilters = (emails: Email[], rules: FilterRule[]): Email[] => {
  if (rules.length === 0) return emails;

  return emails.map(email => {
    let matchedEmail = { ...email }; // Create a mutable copy
    for (const rule of rules) {
      if (!rule.isActive) continue;

      const conditionsMet = rule.conditions.every(condition => checkCondition(matchedEmail, condition));
      
      if (conditionsMet) {
        // Apply action
        switch (rule.action.type) {
          case 'moveToCategory':
            if (rule.action.category) matchedEmail.category = rule.action.category;
            break;
          case 'setPriority':
            if (rule.action.priority) matchedEmail.priority = rule.action.priority;
            break;
          case 'markAsRead':
            matchedEmail.read = true;
            break;
          case 'delete':
            matchedEmail.category = EmailCategory.Spam; // Or a "Trash" category if available, for now Spam acts as deleted
            break;
          // ForwardTo and AutoReply are more complex and would typically involve backend/notifications
          case 'forwardTo':
             console.log(`Email ${email.id} would be forwarded to ${rule.action.forwardEmail}`);
             break;
        }
        // A rule has matched and acted, potentially stop further rule processing for this email or allow cascading
        // For simplicity, let's say first matching active rule applies its primary action.
        // More complex logic (e.g., "stop processing more rules") could be added to rule definition.
        // break; // Uncomment if only one rule should apply
      }
    }
    return matchedEmail;
  });
};

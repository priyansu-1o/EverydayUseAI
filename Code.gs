// Code.gs

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Event Feedback Form Generator')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function generateFeedbackForm(eventDescription) {
  try {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in Script Properties.");
    }

    const systemPrompt = getSystemPrompt();
    const prompt = `Event Description:\n\n${eventDescription}`;
    
    // Call Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;
    
    const payload = {
      "system_instruction": {
        "parts": [{ "text": systemPrompt }]
      },
      "contents": [{
        "parts": [{ "text": prompt }]
      }],
      "generationConfig": {
        "temperature": 0.2,
        "response_mime_type": "application/json"
      }
    };
    
    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true
    };
    
    let response, result;
    let maxRetries = 5;      // Increased to 5 retries
    let retryDelay = 4000;   // Start at 4 seconds
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      response = UrlFetchApp.fetch(url, options);
      result = JSON.parse(response.getContentText());
      
      if (result.error) {
        // Check if it's a high demand, rate limit, or server error
        const isTransientError = result.error.code === 503 || result.error.code === 429 || result.error.message.includes("high demand");
        if (isTransientError && attempt < maxRetries) {
          Utilities.sleep(retryDelay);
          retryDelay *= 2; // Exponential backoff: 2s, 4s, 8s
          continue;
        } else {
          throw new Error(result.error.message + (attempt > 0 ? ` (Failed after ${attempt} retries)` : ''));
        }
      }
      
      // If success, exit retry loop
      break;
    }
    
    const textResponse = result.candidates[0].content.parts[0].text;
    const formConfig = JSON.parse(textResponse);
    
    // Create the Google Form
    const formUrl = createFormFromConfig(formConfig);
    
    return { success: true, urls: formUrl };
    
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

function createFormFromConfig(config) {
  const form = FormApp.create(config.title || 'Event Feedback Form');
  
  if (config.description) {
    form.setDescription(config.description);
  }
  
  if (config.questions && Array.isArray(config.questions)) {
    config.questions.forEach(q => {
      let item;
      switch (q.type) {
        case 'SHORT_ANSWER':
          item = form.addTextItem();
          break;
        case 'PARAGRAPH':
          item = form.addParagraphTextItem();
          break;
        case 'MULTIPLE_CHOICE':
          item = form.addMultipleChoiceItem();
          if (q.options) item.setChoiceValues(q.options);
          break;
        case 'CHECKBOX':
          item = form.addCheckboxItem();
          if (q.options) item.setChoiceValues(q.options);
          break;
        case 'LINEAR_SCALE':
          item = form.addScaleItem();
          const lower = q.scaleLower || 1;
          const upper = q.scaleUpper || 5;
          item.setBounds(lower, upper);
          if (q.labelLower && q.labelUpper) {
            item.setLabels(q.labelLower, q.labelUpper);
          }
          break;
        default:
          item = form.addParagraphTextItem();
      }
      
      item.setTitle(q.title);
      if (q.helpText) {
        item.setHelpText(q.helpText);
      }
      if (q.required) {
        item.setRequired(true);
      }
    });
  }
  
  return {
    editUrl: form.getEditUrl(),
    publishedUrl: form.getPublishedUrl()
  };
}

// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  //let action = request.body.result.action;
  console.log ('WebhookClient Actions:' + agent.action);

  function welcome(agent) {
    const welcomemsg = 'Welcome to Financial Industry Dispute Resolution Centre. ' + 
      'Our centre can help you to resolve Financial Product disputes. My name is Fro Bo. '+
      'I can assist you to know more about our centre or file a complaint.';
    agent.add(welcomemsg);
    agent.add(new Suggestion(`About us`));
    agent.add(new Suggestion(`File a complaint`));
    agent.add(new Suggestion(`Contact Us`));
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function knowaboutus(agent){
    const aboutus = 'Our Centre is an independent and impartial institution specialising ' + 
      'in the resolution of disputes between financial institutions and consumers. ' +
      'The Centre provides an affordable and accessible one-stop avenue for consumers to resolve their disputes.';
      agent.add(aboutus);
      agent.add(new Suggestion(`Know More`));
      agent.add(new Suggestion(`Contact Us`));
      agent.add(new Suggestion(`How to File a Complaint`));      
  }

  function knowmore(agent){
    const knowmoreaboutus = `The dispute resolution process comprises of 2 stages. \n` + 
      `First stage, Mediation. When a complaint is first received, it is case managed by our Case Manager. ` +
      `The consumer and the financial institution are encouraged to resolve the dispute in an amicable and fair manner. ` +
      `In appropriate cases, the Case Manager mediates the dispute between the parties. \n` +
      `Second stage, Adjudication. Where the dispute is not settled by mediation, `+
      `the case is heard and adjudicated by a FIDReC Adjudicator or a Panel of Adjudicators. ` +
      `Consumers pay an adjudication case fee when their cases proceed for adjudication.`;

      agent.add(knowmoreaboutus);
      agent.add(new Suggestion(`About Us`));
      agent.add(new Suggestion(`Contact Us`));
      agent.add(new Suggestion(`Welcome`));
      agent.add(new Suggestion(`How to File a Complaint`));
  }

  function contactus(agent){
    const contactus = `Our office is at 36 Robinson Road #15-01 City House Singapore 068877. \n` +
      `Our office main line is Tel: (65) 6327 8878 and email is info@fidrec.com.sg.\n ` +
      `Our opening hours are Mondays, Wednesdays, Fridays 9 am to 6 pm.\n ` + 
      `Tuesdays, Thursdays 9 am to 7.30 pm (prior appointment required after 6 pm)` ;

    agent.add(contactus);
    agent.add(new Card({
       title: `FIDReC Office`,
       imageUrl: 'https://maps.googleapis.com/maps/api/staticmap?zoom=18&size=512x512&maptype=roadmap&markers=size:mid%7Ccolor:red%7Csingapore+068877&key=AIzaSyCtK-qCvOhcO67gdbPQW-KX8BlDudH9RLU',
       //text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
       //buttonText: 'This is a button',
       //buttonUrl: 'https://assistant.google.com/'
     })
    );
    agent.add(new Suggestion(`About Us`));
    agent.add(new Suggestion(`Welcome`));
    agent.add(new Suggestion(`Contact Us`));
    agent.add(new Suggestion(`How to File Complaint`));

  }

  function howtofilecomplaint(agent){
    const howtofile1 = `The process of initiating a complaint is simple. \n` +
      `Consumers who have not been able to resolve `+
      `with a financial institution can file a complaint free of charge. \n`+ 
      `On receipt, a Case Manager will process the complaint. ` +
      `If the complaint is within FIDReC's jurisdiction, the Case Manager `+
      `will faciliate a resolution of dispute with the financial institution concerned and ` +
      `if possible through case management and mediation.`;
    const howtofile2 = `If a resolution cannot be reached, the consumer may then choose to take the ` + 
      `complaint further by referring the dispute for adjudication. ` + 
      `Consumers need to pay an adjudication case fee when their case proceed to adjudication.\n` +
      `The jurisdiction of FIDReC in adjudicating disputes between the financial institutions and consumers `+
      `is up to S$100,000 per claim. `;
    agent.add(howtofile1);
    agent.add(howtofile2);
    agent.add(new Suggestion(`About Us`));
    agent.add(new Suggestion(`Contact Us`));
    agent.add(new Suggestion(`Welcome`));
    agent.add(new Suggestion(`File Complaint`));

  }

  function filingfee(agent){
    const filingfeetx= `When a dispute is resolved at mediation, our services are free of charge to the disputant. \n`  +
      `If the dispute cannot be resolved at mediation, the case proceeds for adjudication. ` +
      `Disputants pay a nominal administrative fee of S$50 (subject to prevailing GST) per claim ` +
      `or S$250 (subject to prevailing GST) for disputes within the FIDReC-NIMA Scheme.`;
    agent.add(filingfeetx);
    agent.add(new Suggestion(`About Us`));
    agent.add(new Suggestion(`Contact Us`));
    agent.add(new Suggestion(`Welcome`));
    agent.add(new Suggestion(`File Complaint`));
  }

  function filecomplaint(agent){
    const filecomplainttx = `Before we start, are you complaining against `+ 
      `Motor, Travel, Domestic Maid, Home Protection Insurance or Other Financial Products.`;

      agent.add(filecomplainttx);
  }

  function handle_complainttype(agent){
    
    const complainttypeval = agent.parameters.complainttype;
    var context = agent.getContext('complainttype');
    console.log('Context name JSON stringify :' + JSON.stringify(context.parameters));
    const complainttypeval_orig = context.parameters['complainttype.original'];
    var responsetx;
    console.log('complainttypeval: ' + complainttypeval);
    if (complainttypeval === "general-insurance"){
      responsetx = 'Alright, your are complaining against '+ complainttypeval_orig +' Insurance. \n' +
        'Can you provide your email address for me to send you the Dispute Resolution Form?';

    } else {
      responsetx = 'Alright, your are complaining against Others financial products. \n' +
        'Can you provide your email address for me to send you the Dispute Resolution Form?';
    }
    agent.setContext('newcomplaint-askemail');
    agent.add(responsetx);
  }

  function handle_complaintype_fallback(agent){
    var responsetx;

    responsetx = 'If you are not sure about the product you are complaining against, please select Others.';
    agent.add(responsetx); 
  }

  function handle_sendDRFviaemail(agent){
    const email = agent.parameters.complainant_email;

    var  responsetx = 'Thank you! A Dispute Resolution Form has been sent to ' + email +
    '. Do you want me to guide you through the filling up of the form';

    agent.add(responsetx); 
    agent.add(new Suggestion(`Resend DRF`));
    agent.add(new Suggestion(`Contact Us`));
    agent.add(new Suggestion(`Welcome`));
  }

  function handle_helpfillform(agent){

    var responsetx = 'Please enter the section which you are in doubt'
    agent.add(responsetx); 
    agent.add(new Suggestion(`Resend DRF`));
    agent.add(new Suggestion(`Contact Us`));
    agent.add(new Suggestion(`Welcome`));

  }
  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('About Us', knowaboutus);
  intentMap.set('Know more about us', knowmore);
  intentMap.set('Contact Us', contactus);
  intentMap.set('How to file a complaint', howtofilecomplaint);
  intentMap.set('Filing fee',filingfee);
  intentMap.set('File.New.Complaint',filecomplaint);
  intentMap.set('File.New.Complaint.Type', handle_complainttype);
  intentMap.set('File.New.Complaint.fallback', handle_complaintype_fallback);
  intentMap.set('File.New.Complaint.Type.Askemail',handle_sendDRFviaemail);
  intentMap.set('File.New.Complaint.Type.Askemail.yes', handle_helpfillform);

  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});

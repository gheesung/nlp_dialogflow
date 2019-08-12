from flask import Flask, request, abort
from pydialogflow_fulfillment import DialogflowResponse, DialogflowRequest, SimpleResponse
from pydialogflow_fulfillment import Suggestions, Card, BrowsingCarousel, OutputContexts
from pydialogflow_fulfillment import Carousel
from collections import OrderedDict

app = Flask(__name__)

def read_apikey():
    f=open('config/apikey.txt','r')
    apikey=f.readline()
    f.close()
    return apikey


def intent_welcome(dialogflow_request):
    textResponse = "Welcome to Mini Flower. My shop provides flower and gift for all occasions. How can I help you?"
    dialogflow_response = DialogflowResponse(textResponse)
    dialogflow_response.add(SimpleResponse(textResponse,textResponse))
    #https://www.marinabaysands.com/content/dam/singapore/marinabaysands/master/main/home/sg-visitors-guide/Gardens-by-the-bay/Gardens%20by%20the%20Bay_959x554.jpg
    card = OrderedDict()
    card["title"] = "Welcome"
    card["formatted_text"] ="Your one-stop shop for all your gift"
    card["image_uri"] = "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
    card["accessibilityText"] =  "Welcome"
    dialogflow_response.add(Card(card))

    dialogflow_response.add(Suggestions(["Contact Us", "Browse Gift", "Help"]))

    return dialogflow_response

def intent_contactus(dialogflow_request):
    contactustxt = """Our office is at 79 Ayer Rajah Crescent, #01-13/14, Singapore 139955. \n
    Our phone is: (65) 98765432 and email is gheesung@gheesung.com.\n 
    Our opening hours are Mondays, Wednesdays, Fridays 9 am to 6 pm.\n 
    """
    dialogflow_response = DialogflowResponse(contactustxt)
    dialogflow_response.add(SimpleResponse(contactustxt,contactustxt))

    shorttxt = """79 Ayer Rajah Crescent, #01-13/14, Singapore 139955. \n
    Tel: (65) 98765432
    Email: gheesung@gheesung.com.
    """
    apikey = read_apikey()

    card = OrderedDict()
    card["title"] = "Our Shop Location"
    card["formatted_text"] =shorttxt
    image_url = "https://maps.googleapis.com/maps/api/staticmap?zoom=18&size=512x512&maptype=roadmap&markers=size:mid%7Ccolor:red%7Csingapore+139955&key=" + apikey
    card["image_uri"] = image_url
    card["accessibilityText"] =  "Shop Location"
    dialogflow_response.add(Card(card))

    dialogflow_response.add(Suggestions(["Browse Gift", "Help"]))

    return dialogflow_response

def intent_howtoorder(dialogflow_request):
    howtoordertxt = """Great! Before we start,how can I address you?
    """
    dialogflow_response = DialogflowResponse(howtoordertxt)
    dialogflow_response.add(SimpleResponse(howtoordertxt,howtoordertxt))
    return dialogflow_response

def intent_greeting_show_catalog(dialogflow_request)    :
    name = dialogflow_request.get_paramter("given-name")
    greetingtxt = "Hi {0}, the catalog is not ready yet. Come back another day.".format(name)
    
    dialogflow_response = DialogflowResponse(greetingtxt)
    dialogflow_response.add(SimpleResponse(greetingtxt, greetingtxt))
    # create a dummy catalog
    #catalog = []
    #catalog_list = OrderedDict()
    #catalog_list["title"] = "For your love one"
    #catalog_list["description"] = "Gift for your love one"
    #catalog_list["footer"] = "More information about the gift"
    #catalog_list["accessibilityText"] = "Item 1"
    #catalog_list["image_uri"] = "https://cdn.shopify.com/s/files/1/1252/1803/products/hari-raya-gift-set-02-7262173298801_600x.jpg"
    #catalog.append(catalog_list)
    #catalog.append(catalog_list)
    #dialogflow_response.add(BrowsingCarousel(catalog))

    return dialogflow_response

def intent_help(dialogflow_request):
    helptxt = """I see that you need some assistance. How can I address you?
    """
    dialogflow_response = DialogflowResponse(helptxt)
    dialogflow_response.add(SimpleResponse(helptxt,helptxt))
    return dialogflow_response

def intent_help_complaindetails(dialogflow_request):
    name = dialogflow_request.get_paramter("person")
    greetingtxt = "Hi {0}, what is it you want to need help?".format(name["name"])
    
    dialogflow_response = DialogflowResponse(greetingtxt)
    dialogflow_response.add(SimpleResponse(greetingtxt, greetingtxt))
    dialogflow_response.add(Suggestions(["Refund"]))

    parameters= OrderedDict()
    parameters["person"] = dialogflow_request.get_paramter("person")
    dialogflow_response.add(OutputContexts(dialogflow_request.get_project_id, dialogflow_request.get_session_id, "Complaint_getname-followup", 4, parameters))
    return dialogflow_response

def intent_refund(dialogflow_request):
    prev_output_context = dialogflow_request.get_ouputcontext_list()
    name = prev_output_context[0]["parameters"]["person"]["name"]
    greetingtxt = name + ", I am sorry that you are not happy with our service. " 
    helptxt = """To help us process your refund, can you provide us your email or contact number. 
    """

    dialogflow_response = DialogflowResponse(greetingtxt + helptxt)
    dialogflow_response.add(SimpleResponse(greetingtxt + helptxt, greetingtxt + helptxt))
    dialogflow_response.add(Suggestions(["Refund"]))
    return dialogflow_response

def intent_refund_details(dialogflow_request):
    helptxt = """Thanks for providing us your contact information. We will get back to you the next working day.
    """
    dialogflow_response = DialogflowResponse(helptxt)
    dialogflow_response.add(SimpleResponse(helptxt, helptxt))
    return dialogflow_response   

@app.route('/', methods=['GET', 'POST'])
def index_page():
    if request.method == 'POST':
        dialogflow_request = DialogflowRequest(request.data)
        print (dialogflow_request.get_intent_displayName())

        # Welcome
        if dialogflow_request.get_intent_displayName() == "welcome_intent":
            dialogflow_response = intent_welcome(dialogflow_request)
            response = app.response_class(response=dialogflow_response.get_final_response(),mimetype='application/json')
        
        # Contact US
        if dialogflow_request.get_intent_displayName() == "contact_us":
            dialogflow_response = intent_contactus(dialogflow_request)
            response = app.response_class(response=dialogflow_response.get_final_response(),mimetype='application/json')
        
        # How to order
        if dialogflow_request.get_intent_displayName() == "how_to_order":
            dialogflow_response = intent_howtoorder(dialogflow_request)
            response = app.response_class(response=dialogflow_response.get_final_response(),mimetype='application/json')

        # Greeting and show catalog
        if dialogflow_request.get_intent_displayName() == "how_to_order - Get Name":
            dialogflow_response = intent_greeting_show_catalog(dialogflow_request)
            response = app.response_class(response=dialogflow_response.get_final_response(),mimetype='application/json')
        
        # Complaint
        if dialogflow_request.get_intent_displayName() == "Complaint":
            dialogflow_response = intent_help(dialogflow_request)
            response = app.response_class(response=dialogflow_response.get_final_response(),mimetype='application/json')
        # Complaint - Get name
        if dialogflow_request.get_intent_displayName() == "Complaint_getname":
            dialogflow_response = intent_help_complaindetails(dialogflow_request)
            response = app.response_class(response=dialogflow_response.get_final_response(),mimetype='application/json')

        if dialogflow_request.get_intent_displayName() == "Refund":
            dialogflow_response = intent_refund(dialogflow_request)
            response = app.response_class(response=dialogflow_response.get_final_response(),mimetype='application/json')

        if dialogflow_request.get_intent_displayName() == "get_refund_details":
            dialogflow_response = intent_refund_details(dialogflow_request)
            response = app.response_class(response=dialogflow_response.get_final_response(),mimetype='application/json')
            
        #else:
        #    dialogflow_response = DialogflowResponse()
        #    dialogflow_response.add(SimpleResponse("Welcome to my test dialogflow webhook","Welcome to my test dialogflow webhook"))
        #    dialogflow_response.add(Suggestions(["Contact Us","Sync","More info"]))
        #    response = app.response_class(response=dialogflow_response.get_final_response(),mimetype='application/json')
        return response
    else:
        abort(404)
if __name__ == "__main__":
	app.run(host='0.0.0.0', port=8080, debug=True)


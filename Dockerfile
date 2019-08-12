#
#--------------------------------------------------------------------------
# Install
#--------------------------------------------------------------------------
#

FROM python:3.7

#--------------------------------------------------------------------------
# Source code and Configuration
#--------------------------------------------------------------------------
COPY ./src /app
WORKDIR /app
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD [ "bot_app.py" ]


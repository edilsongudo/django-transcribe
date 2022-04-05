# Django Audio to Text Converter

### Step 1
In settings, set the ASSEMBLYAI_TOKEN.
Also create an s3 buckets on AWS and set the AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_STORAGE_BUCKET_NAME on settings.py

### Step 2
Set up Celery and a message broker such as Rabbitmq or Redis
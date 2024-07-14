from django.shortcuts import render

# qrcode_app/views.py

import qrcode
from io import BytesIO
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import json

# Generate QR code and save to MongoDB
@csrf_exempt
def generate_qr(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get('name')
        if name:
            # Generate QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(name)
            qr.make(fit=True)
            img = qr.make_image(fill='black', back_color='white')

            # Save QR code image to BytesIO
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            qr_code_data = buffer.getvalue()

            # Save to MongoDB
            collection = settings.MONGO_DB.qrcodes
            qr_code_record = {"name": name, "qr_code": qr_code_data}
            collection.insert_one(qr_code_record)

            return JsonResponse({"qrCode": name})
        return JsonResponse({"error": "Name is required"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

# Get QR code image from MongoDB
def get_qr(request, name):
    collection = settings.MONGO_DB.qrcodes
    qr_code_record = collection.find_one({"name": name})
    if qr_code_record:
        return HttpResponse(qr_code_record['qr_code'], content_type="image/png")
    return JsonResponse({"error": "QR code not found"}, status=404)

def hello_world(request):
    try:
        settings.MONGO_CLIENT.server_info()  # 尝试连接服务器
        mongo_status = "MongoDB connection successful"
    except Exception as e:
        mongo_status = f"MongoDB connection error: {e}"
        print("MongoDB connection error:", e)
    
    return JsonResponse({"message": "Hello, World!", "mongo_status": mongo_status})


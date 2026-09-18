"""Bulk add schemes to the DB.

Usage:
    python -m scripts.seed_batch <batch_number>

Loads schemes for the given batch from app/batch_data/ and inserts them
into the database. Idempotent: existing slugs are skipped.
"""
import sys
from datetime import date
from pathlib import Path
from app.database import SessionLocal
from app.models.scheme import Scheme


# ---------------------------------------------------------------------------
# BATCH DEFINITIONS
# Each batch is a list of dicts matching the Scheme model fields.
# Slugs must be unique across all batches and the original 20 schemes.
# ---------------------------------------------------------------------------

BATCHES = {}

# ============================================================================
# BATCH 3 — 10 schemes
# ============================================================================
BATCHES[3] = [
    {
        "slug": "pm-svanidhi",
        "short_name": "PM SVANidhi",
        "category": "business",
        "name": {
            "en": "PM Street Vendor's AtmaNirbhar Nidhi",
            "ta": "பிரதம மந்திரி தெரு வியாபாரிகள் ஆத்மநிர்பர் நிதி",
            "hi": "पीएम स्ट्रीट वेंडर आत्मनिर्भर निधि",
        },
        "department": {
            "en": "Ministry of Housing and Urban Affairs, Govt of India",
            "ta": "வீட்டுவசதி மற்றும் நகர்ப்புற விவகாரங்கள் அமைச்சகம்",
            "hi": "आवास और शहरी मामलों के मंत्रालय, भारत सरकार",
        },
        "description": {
            "en": "Working capital loans of ₹10,000 to ₹50,000 for street vendors with 7% interest subsidy on timely repayment. Enables vendors to resume livelihoods post-COVID.",
            "ta": "தெரு வியாபாரிகளுக்கு ₹10,000 முதல் ₹50,000 வரை மூலதனக் கடன், சரியான திருப்பிச் செலுத்தலுக்கு 7% வட்டி மானியம்.",
            "hi": "फुटपाथ विक्रेताओं को ₹10,000 से ₹50,000 तक कार्यशील पूंजी ऋण, समय पर भुगतान पर 7% ब्याज सब्सिडी।",
        },
        "min_age": 18, "max_age": None, "max_income": None,
        "eligible_categories": ["General", "OBC", "BC", "MBC", "SC", "ST"],
        "eligible_genders": None,
        "eligible_business_status": ["existing"],
        "education": None,
        "max_loan": 50000,
        "interest_rate": "7% interest subsidy",
        "subsidy_percent": 7,
        "moratorium": None,
        "repayment_years": "1 year",
        "documents": ["Aadhaar Card", "Vendor Certificate / LoR", "Bank account details", "Passport photo"],
        "source_url": "https://pmsvanidhi.mohua.gov.in/",
        "last_verified": date(2026, 9, 15),
        "verified_by": "Admin User",
    },
    {
        "slug": "pm-fme",
        "short_name": "PMFME",
        "category": "food_processing",
        "name": {
            "en": "PM Formalisation of Micro Food Processing Enterprises",
            "ta": "பிரதம மந்திரி நுண் உணவு பதப்படுத்தும் நிறுவனங்களின் முறைப்படுத்தல்",
            "hi": "पीएम सूक्ष्म खाद्य प्रसंस्करण उद्यमों का औपचारिकीकरण",
        },
        "department": {
            "en": "Ministry of Food Processing Industries",
            "ta": "உணவு பதப்படுத்தும் தொழில்கள் அமைச்சகம்",
            "hi": "खाद्य प्रसंस्करण उद्योग मंत्रालय",
        },
        "description": {
            "en": "Credit-linked 35% subsidy up to ₹10 lakh for micro food processing units. Includes seed capital for SHGs, branding and marketing support.",
            "ta": "நுண் உணவு பதப்படுத்தும் நிறுவனங்களுக்கு 35% மானியம் ₹10 லட்சம் வரை. SHG-க்கு விதை மூலதனம், பிராண்டிங் ஆதரவு.",
            "hi": "सूक्ष्म खाद्य प्रसंस्करण इकाइयों के लिए 35% सब्सिडी ₹10 लाख तक। SHG के लिए सीड कैपिटल सहित।",
        },
        "min_age": 18, "max_age": None, "max_income": None,
        "eligible_categories": ["General", "OBC", "BC", "MBC", "SC", "ST"],
        "eligible_genders": None,
        "eligible_business_status": ["new", "existing"],
        "education": None,
        "max_loan": 1000000,
        "interest_rate": "As per bank",
        "subsidy_percent": 35,
        "moratorium": "6 months",
        "repayment_years": "5 years",
        "documents": ["Aadhaar Card", "PAN Card", "Udyam Registration", "Project Report", "Bank Statements"],
        "source_url": "https://pmfme.mofpi.gov.in/",
        "last_verified": date(2026, 9, 15),
        "verified_by": "Admin User",
    },
    {
        "slug": "pm-vishwakarma",
        "short_name": "PM Vishwakarma",
        "category": "handicraft",
        "name": {
            "en": "PM Vishwakarma Yojana",
            "ta": "பிரதம மந்திரி விஸ்வகர்மா திட்டம்",
            "hi": "पीएम विश्वकर्मा योजना",
        },
        "department": {
            "en": "Ministry of MSME, Govt of India",
            "ta": "MSME அமைச்சகம், இந்திய அரசு",
            "hi": "MSME मंत्रालय, भारत सरकार",
        },
        "description": {
            "en": "Support for 18 traditional trades (carpenter, blacksmith, potter, tailor, etc.) with skill training, toolkit incentive, collateral-free credit at 5% interest, and digital marketing support.",
            "ta": "18 பாரம்பரிய தொழில்களுக்கு (தச்சர், கொல்லர், குயவர், தையல்காரர்) திறன் பயிற்சி, கருவி ஊக்கம், 5% வட்டியில் பிணையமில்லா கடன்.",
            "hi": "18 पारंपरिक व्यवसायों (बढ़ई, लोहार, कुम्हार, दर्जी) के लिए कौशल प्रशिक्षण, टूलकिट प्रोत्साहन, 5% ब्याज पर बिना जमानत ऋण।",
        },
        "min_age": 18, "max_age": None, "max_income": None,
        "eligible_categories": ["General", "OBC", "BC", "MBC", "SC", "ST"],
        "eligible_genders": None,
        "eligible_business_status": ["new", "existing"],
        "education": None,
        "max_loan": 300000,
        "interest_rate": "5%",
        "subsidy_percent": 0,
        "moratorium": "6 months",
        "repayment_years": "18 months",
        "documents": ["Aadhaar Card", "PAN Card", "Bank account details", "Proof of trade (self-declaration)", "Passport photo"],
        "source_url": "https://pmvishwakarma.gov.in/",
        "last_verified": date(2026, 9, 15),
        "verified_by": "Admin User",
    },
    {
        "slug": "sfurti",
        "short_name": "SFURTI",
        "category": "handicraft",
        "name": {
            "en": "Scheme of Fund for Regeneration of Traditional Industries",
            "ta": "பாரம்பரிய தொழில்கள் மறுமலர்ச்சி நிதித் திட்டம்",
            "hi": "पारंपरिक उद्योगों के पुनरुद्धार के लिए निधि योजना",
        },
        "department": {
            "en": "Ministry of MSME, Govt of India",
            "ta": "MSME அமைச்சகம், இந்திய அரசு",
            "hi": "MSME मंत्रालय, भारत सरकार",
        },
        "description": {
            "en": "Organizes traditional artisans into clusters with common facility centers, design intervention, skill training and market linkages. Up to 90% government funding.",
            "ta": "பாரம்பரிய கைவினைஞர்களை கிளஸ்டர்களாக ஒழுங்கமைத்து, பொது வசதி மையங்கள், வடிவமைப்பு, திறன் பயிற்சி, சந்தை இணைப்புகள். 90% வரை அரசு நிதி.",
            "hi": "पारंपरिक कारीगरों को समूहों में संगठित कर सामान्य सुविधा केंद्र, डिज़ाइन सहायता, कौशल प्रशिक्षण और बाजार संपर्क। 90% तक सरकारी निधि।",
        },
        "min_age": 18, "max_age": None, "max_income": None,
        "eligible_categories": ["General", "OBC", "BC", "MBC", "SC", "ST"],
        "eligible_genders": None,
        "eligible_business_status": ["new", "existing"],
        "education": None,
        "max_loan": 25000000,
        "interest_rate": "N/A",
        "subsidy_percent": 90,
        "moratorium": None,
        "repayment_years": None,
        "documents": ["Cluster proposal", "NGO / Implementing agency registration", "Artisan list", "Bank account details"],
        "source_url": "https://sfurti.msme.gov.in/",
        "last_verified": date(2026, 9, 15),
        "verified_by": "Admin User",
    },
    {
        "slug": "mahila-coir",
        "short_name": "Mahila Coir",
        "category": "women",
        "name": {
            "en": "Mahila Coir Yojana",
            "ta": "மகளிர் கயிறு திட்டம்",
            "hi": "महिला कॉयर योजना",
        },
        "department": {
            "en": "Coir Board, Ministry of MSME",
            "ta": "கயிறு வாரியம், MSME அமைச்சகம்",
            "hi": "कॉयर बोर्ड, MSME मंत्रालय",
        },
        "description": {
            "en": "75% subsidy on coir processing equipment for rural women artisans. Includes training in coir spinning and product manufacturing for self-employment.",
            "ta": "கிராமப்புற பெண் கைவினைஞர்களுக்கு கயிறு பதப்படுத்தும் உபகரணங்களுக்கு 75% மானியம். பயிற்சியும் உள்ளடக்கம்.",
            "hi": "ग्रामीण महिला कारीगरों को कॉयर प्रसंस्करण उपकरण पर 75% सब्सिडी। प्रशिक्षण सहित।",
        },
        "min_age": 18, "max_age": None, "max_income": None,
        "eligible_categories": ["General", "OBC", "BC", "MBC", "SC", "ST"],
        "eligible_genders": ["female"],
        "eligible_business_status": ["new"],
        "education": None,
        "max_loan": 200000,
        "interest_rate": "As per bank",
        "subsidy_percent": 75,
        "moratorium": "6 months",
        "repayment_years": "5 years",
        "documents": ["Aadhaar Card", "Coir Board registration", "Training certificate", "Bank account details"],
        "source_url": "https://coirboard.gov.in/",
        "last_verified": date(2026, 9, 15),
        "verified_by": "Admin User",
    },
    {
        "slug": "twees",
        "short_name": "TWEES",
        "category": "women",
        "name": {
            "en": "Tamil Nadu Women Entrepreneurs Empowerment Scheme",
            "ta": "தமிழ்நாடு பெண் தொழில்முனைவோர் அதிகாரமளித்தல் திட்டம்",
            "hi": "तमिलनाडु महिला उद्यमी सशक्तिकरण योजना",
        },
        "department": {
            "en": "MSME Department, Government of Tamil Nadu",
            "ta": "MSME துறை, தமிழ்நாடு அரசு",
            "hi": "MSME विभाग, तमिलनाडु सरकार",
        },
        "description": {
            "en": "25% capital subsidy up to ₹2 lakh for women entrepreneurs in Tamil Nadu to set up manufacturing or service enterprises.",
            "ta": "தமிழ்நாட்டில் பெண் தொழில்முனைவோருக்கு உற்பத்தி அல்லது சேவை நிறுவனங்களை அமைக்க ₹2 லட்சம் வரை 25% மூலதன மானியம்.",
            "hi": "तमिलनाडु में महिला उद्यमियों को विनिर्माण या सेवा उद्यम स्थापित करने के लिए ₹2 लाख तक 25% पूंजी सब्सिडी।",
        },
        "min_age": 21, "max_age": 55, "max_income": None,
        "eligible_categories": ["General", "OBC", "BC", "MBC", "SC", "ST"],
        "eligible_genders": ["female"],
        "eligible_business_status": ["new"],
        "education": None,
        "max_loan": 2000000,
        "interest_rate": "As per bank",
        "subsidy_percent": 25,
        "moratorium": "6 months",
        "repayment_years": "5 years",
        "documents": ["Aadhaar Card", "PAN Card", "Project Report", "Community Certificate", "Bank Statements"],
        "source_url": "https://www.msmeonline.tn.gov.in/",
        "last_verified": date(2026, 9, 15),
        "verified_by": "Admin User",
    },
    {
        "slug": "tahdco-vetri",
        "short_name": "TAHDCO Vetri",
        "category": "sc_st",
        "name": {
            "en": "TAHDCO Vetri Thozhil Munaivor Thittam",
            "ta": "டஹ்ட்கோ வெற்றி தொழில் முனைவோர் திட்டம்",
            "hi": "TAHDCO वेत्त्री थोझिल मुनैवोर थिट्टम",
        },
        "department": {
            "en": "TAHDCO, Government of Tamil Nadu",
            "ta": "டஹ்ட்கோ, தமிழ்நாடு அரசு",
            "hi": "TAHDCO, तमिलनाडु सरकार",
        },
        "description": {
            "en": "35% capital subsidy (max ₹3.50 lakh) plus 6% interest subsidy for SC/ST first-generation entrepreneurs to start manufacturing, service, or business enterprises.",
            "ta": "SC/ST முதல் தலைமுறை தொழில்முனைவோருக்கு 35% மூலதன மானியம் (அதிகபட்சம் ₹3.50 லட்சம்) மற்றும் 6% வட்டி மானியம்.",
            "hi": "SC/ST प्रथम-पीढ़ी के उद्यमियों को 35% पूंजी सब्सिडी (अधिकतम ₹3.50 लाख) और 6% ब्याज सब्सिडी।",
        },
        "min_age": 18, "max_age": 55, "max_income": None,
        "eligible_categories": ["SC", "ST"],
        "eligible_genders": None,
        "eligible_business_status": ["new"],
        "education": None,
        "max_loan": 1000000,
        "interest_rate": "6% subvention",
        "subsidy_percent": 35,
        "moratorium": "6 months",
        "repayment_years": "5 years",
        "documents": ["Aadhaar Card", "PAN Card", "Community Certificate", "Income Certificate", "Project Report", "Bank Statements"],
        "source_url": "https://www.tahdco.tn.gov.in/",
        "last_verified": date(2026, 9, 15),
        "verified_by": "Admin User",
    },
    {
        "slug": "pm-kisan-samman",
        "short_name": "PM-KISAN",
        "category": "agriculture",
        "name": {
            "en": "Pradhan Mantri Kisan Samman Nidhi",
            "ta": "பிரதம மந்திரி கிசான் சம்மான் நிதி",
            "hi": "प्रधानमंत्री किसान सम्मान निधि",
        },
        "department": {
            "en": "Ministry of Agriculture & Farmers Welfare",
            "ta": "வேளாண்மை மற்றும் விவசாயிகள் நல அமைச்சகம்",
            "hi": "कृषि और किसान कल्याण मंत्रालय",
        },
        "description": {
            "en": "Direct income support of ₹6,000/year in three installments to small and marginal farmer families. Provides working capital for agriculture.",
            "ta": "சிறு மற்றும் குறு விவசாயிகளுக்கு ₹6,000/ஆண்டு மூன்று தவணைகளில் நேரடி வருமான ஆதரவு.",
            "hi": "छोटे और सीमांत किसान परिवारों को ₹6,000/वर्ष तीन किस्तों में प्रत्यक्ष आय सहायता।",
        },
        "min_age": 18, "max_age": None, "max_income": None,
        "eligible_categories": ["General", "OBC", "BC", "MBC", "SC", "ST"],
        "eligible_genders": None,
        "eligible_business_status": ["new", "existing"],
        "education": None,
        "max_loan": 6000,
        "interest_rate": "N/A",
        "subsidy_percent": 100,
        "moratorium": None,
        "repayment_years": None,
        "documents": ["Aadhaar Card", "Land ownership records", "Bank account details"],
        "source_url": "https://pmkisan.gov.in/",
        "last_verified": date(2026, 9, 15),
        "verified_by": "Admin User",
    },
    {
        "slug": "kcc",
        "short_name": "KCC",
        "category": "agriculture",
        "name": {
            "en": "Kisan Credit Card Scheme",
            "ta": "கிசான் கடன் அட்டை திட்டம்",
            "hi": "किसान क्रेडिट कार्ड योजना",
        },
        "department": {
            "en": "Ministry of Agriculture & Farmers Welfare",
            "ta": "வேளாண்மை மற்றும் விவசாயிகள் நல அமைச்சகம்",
            "hi": "कृषि और किसान कल्याण मंत्रालय",
        },
        "description": {
            "en": "Short-term credit for crop production, post-harvest expenses, and consumption needs for farmers, dairy, poultry, and fisheries. Interest subvention up to 3%.",
            "ta": "பயிர் உற்பத்தி, அறுவடைக்குப் பின் செலவுகள், விவசாயிகள்/பால்/கோழி/மீன்வளத்திற்கு குறுகிய கால கடன். 3% வரை வட்டி மானியம்.",
            "hi": "फसल उत्पादन, कटाई के बाद के खर्च और उपभोग के लिए अल्पकालिक ऋण। 3% तक ब्याज सब्सिडी।",
        },
        "min_age": 18, "max_age": None, "max_income": None,
        "eligible_categories": ["General", "OBC", "BC", "MBC", "SC", "ST"],
        "eligible_genders": None,
        "eligible_business_status": ["new", "existing"],
        "education": None,
        "max_loan": 300000,
        "interest_rate": "7% (with subsidy)",
        "subsidy_percent": 3,
        "moratorium": "12 months",
        "repayment_years": "As per crop cycle",
        "documents": ["Aadhaar Card", "Land documents", "Bank account details", "Passport photo"],
        "source_url": "https://www.nabard.org/",
        "last_verified": date(2026, 9, 15),
        "verified_by": "Admin User",
    },
    {
        "slug": "pm-kisan-maandhan",
        "short_name": "PM-KMY",
        "category": "agriculture",
        "name": {
            "en": "Pradhan Mantri Kisan Maandhan Yojana",
            "ta": "பிரதம மந்திரி கிசான் மான்தன் திட்டம்",
            "hi": "प्रधानमंत्री किसान मानधन योजना",
        },
        "department": {
            "en": "Ministry of Agriculture & Farmers Welfare",
            "ta": "வேளாண்மை மற்றும் விவசாயிகள் நல அமைச்சகம்",
            "hi": "कृषि और किसान कल्याण मंत्रालय",
        },
        "description": {
            "en": "Voluntary pension scheme for small and marginal farmers. Government matches the monthly contribution; ₹3,000/month pension after age 60.",
            "ta": "சிறு மற்றும் குறு விவசாயிகளுக்கு தன்னார்வ ஓய்வூதிய திட்டம். மாத பங்களிப்பை அரசு பொருத்துகிறது; 60 வயதுக்குப் பிறகு ₹3,000/மாதம் ஓய்வூதியம்.",
            "hi": "छोटे और सीमांत किसानों के लिए स्वैच्छिक पेंशन योजना। सरकार मासिक योगदान का मिलान करती है; 60 वर्ष के बाद ₹3,000/माह पेंशन।",
        },
        "min_age": 18, "max_age": 40, "max_income": None,
        "eligible_categories": ["General", "OBC", "BC", "MBC", "SC", "ST"],
        "eligible_genders": None,
        "eligible_business_status": ["new", "existing"],
        "education": None,
        "max_loan": None,
        "interest_rate": "N/A",
        "subsidy_percent": 50,
        "moratorium": None,
        "repayment_years": None,
        "documents": ["Aadhaar Card", "Bank passbook", "Land records", "Passport photo"],
        "source_url": "https://maandhan.in/",
        "last_verified": date(2026, 9, 15),
        "verified_by": "Admin User",
    },
]


# ---------------------------------------------------------------------------
# SEED LOGIC
# ---------------------------------------------------------------------------

def seed_batch(batch_number: int):
    if batch_number not in BATCHES:
        print(f"[ERR] No batch {batch_number} defined")
        print(f"[INFO] Available batches: {sorted(BATCHES.keys())}")
        return

    schemes = BATCHES[batch_number]
    db = SessionLocal()
    added = 0
    skipped = 0

    try:
        for s in schemes:
            existing = db.query(Scheme).filter(Scheme.slug == s["slug"]).first()
            if existing:
                skipped += 1
                continue
            db.add(Scheme(**s))
            added += 1
        db.commit()

        total = db.query(Scheme).count()
        print(f"[OK] Batch {batch_number}: added {added}, skipped {skipped}")
        print(f"[OK] Total schemes in DB: {total}")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python -m scripts.seed_batch <batch_number>")
        print(f"Available: {sorted(BATCHES.keys())}")
        sys.exit(1)
    try:
        n = int(sys.argv[1])
    except ValueError:
        print(f"[ERR] Batch number must be an integer, got: {sys.argv[1]}")
        sys.exit(1)
    seed_batch(n)
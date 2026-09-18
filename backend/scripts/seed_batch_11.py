"""Seed batch 11 — final 8 schemes to reach 100 total.

Usage:  python -m scripts.seed_batch_11
Idempotent: existing slugs are skipped.
"""
from datetime import date
from app.database import SessionLocal
from app.models.scheme import Scheme

V = date(2026, 9, 16)
BY = "Admin User"
CATS = ["General", "OBC", "BC", "MBC", "SC", "ST"]


def s(**kw):
    kw.setdefault("status", "active")
    kw.setdefault("verified_by", BY)
    kw.setdefault("last_verified", V)
    return kw


SCHEMES = [
    s(slug="nai-roshni", short_name="Nai Roshni", category="women",
      name={
          "en": "Nai Roshni — Leadership Development for Minority Women",
          "ta": "நயி ரோஷ்னி — சிறுபான்மை பெண்களுக்கான தலைமைத்துவ மேம்பாடு",
          "hi": "नई रोशनी — अल्पसंख्यक महिलाओं के लिए नेतृत्व विकास",
      },
      department={
          "en": "Ministry of Minority Affairs",
          "ta": "சிறுபான்மையினர் நல அமைச்சகம்",
          "hi": "अल्पसंख्यक मामलों का मंत्रालय",
      },
      description={
          "en": "Leadership training and empowerment programme for women from minority communities to enhance their participation in decision-making.",
          "ta": "சிறுபான்மை சமூகங்களின் பெண்களுக்கு தலைமைத்துவ பயிற்சி மற்றும் அதிகாரமளித்தல் திட்டம்.",
          "hi": "अल्पसंख्यक समुदायों की महिलाओं के लिए नेतृत्व प्रशिक्षण और सशक्तिकरण कार्यक्रम।",
      },
      min_age=18, max_age=65, max_income=None, eligible_categories=CATS,
      eligible_genders=["female"], eligible_business_status=["new", "existing"],
      education=None,
      max_loan=None, interest_rate="N/A", subsidy_percent=100,
      moratorium=None, repayment_years=None,
      documents=["Aadhaar Card", "Minority community certificate", "Passport photo"],
      source_url="https://www.minorityaffairs.gov.in/"),

    s(slug="seekho-aur-kamao", short_name="SAK", category="youth",
      name={
          "en": "Seekho Aur Kamao — Skill Development for Minorities",
          "ta": "சீகோ அவுர் கமாவ் — சிறுபான்மையினருக்கு திறன் மேம்பாடு",
          "hi": "सीखो और कमाओ — अल्पसंख्यकों के लिए कौशल विकास",
      },
      department={
          "en": "Ministry of Minority Affairs",
          "ta": "சிறுபான்மையினர் நல அமைச்சகம்",
          "hi": "अल्पसंख्यक मामलों का मंत्रालय",
      },
      description={
          "en": "Placement-linked skill development for minority youth in sectors like IT, healthcare, construction, and retail with 100% financial assistance.",
          "ta": "IT, சுகாதாரம், கட்டுமானம், சில்லறை வணிகத் துறைகளில் சிறுபான்மை இளைஞர்களுக்கு திறன் மேம்பாடு மற்றும் வேலைவாய்ப்பு.",
          "hi": "IT, स्वास्थ्य, निर्माण, खुदरा क्षेत्रों में अल्पसंख्यक युवाओं के लिए कौशल विकास और रोज़गार।",
      },
      min_age=14, max_age=45, max_income=None, eligible_categories=CATS,
      eligible_genders=None, eligible_business_status=["new", "existing"],
      education=None,
      max_loan=None, interest_rate="N/A", subsidy_percent=100,
      moratorium=None, repayment_years=None,
      documents=["Aadhaar Card", "Minority certificate", "Education certificate"],
      source_url="https://www.minorityaffairs.gov.in/"),

    s(slug="usttad", short_name="USTTAD", category="handicraft",
      name={
          "en": "Upgrading the Skills and Training in Traditional Arts/Crafts for Development",
          "ta": "பாரம்பரிய கலை/கைவினை திறன் மேம்பாடு",
          "hi": "पारंपरिक कला/शिल्प कौशल उन्नयन",
      },
      department={
          "en": "Ministry of Minority Affairs",
          "ta": "சிறுபான்மையினர் நல அமைச்சகம்",
          "hi": "अल्पसंख्यक मामलों का मंत्रालय",
      },
      description={
          "en": "Preserves traditional crafts by training minority artisans and linking them to markets through exhibitions and e-commerce.",
          "ta": "சிறுபான்மை கைவினைஞர்களுக்கு பயிற்சி அளித்து, கண்காட்சி மற்றும் மின்-வணிகம் மூலம் சந்தை இணைப்பு.",
          "hi": "अल्पसंख्यक कारीगरों को प्रशिक्षण देकर प्रदर्शनियों और ई-कॉमर्स के माध्यम से बाजार से जोड़ना।",
      },
      min_age=18, max_age=60, max_income=None, eligible_categories=CATS,
      eligible_genders=None, eligible_business_status=["new", "existing"],
      education=None,
      max_loan=500000, interest_rate="Concessional", subsidy_percent=50,
      moratorium="6 months", repayment_years="3 years",
      documents=["Aadhaar Card", "Minority certificate", "Craft proof"],
      source_url="https://www.minorityaffairs.gov.in/"),

    s(slug="tn-udyami-yojana", short_name="TN Udyami", category="business",
      name={
          "en": "Tamil Nadu New Entrepreneur cum Enterprise Development",
          "ta": "தமிழ்நாடு புதிய தொழில்முனைவோர் நிறுவன மேம்பாடு",
          "hi": "तमिलनाडु नया उद्यमी सह उद्यम विकास",
      },
      department={
          "en": "MSME Department, Government of Tamil Nadu",
          "ta": "MSME துறை, தமிழ்நாடு அரசு",
          "hi": "MSME विभाग, तमिलनाडु सरकार",
      },
      description={
          "en": "Capital subsidy up to 25% (max ₹75 lakh) for first-generation entrepreneurs in Tamil Nadu to set up manufacturing or service units.",
          "ta": "தமிழ்நாட்டில் முதல் தலைமுறை தொழில்முனைவோருக்கு 25% வரை (அதிகபட்சம் ₹75 லட்சம்) மூலதன மானியம்.",
          "hi": "तमिलनाडु में प्रथम-पीढ़ी के उद्यमियों को 25% तक (अधिकतम ₹75 लाख) पूंजी सब्सिडी।",
      },
      min_age=21, max_age=45, max_income=None, eligible_categories=CATS,
      eligible_genders=None, eligible_business_status=["new"], education="Graduate or Diploma",
      max_loan=50000000, interest_rate="As per bank", subsidy_percent=25,
      moratorium="6 – 12 months", repayment_years="5 – 10 years",
      documents=["Aadhaar Card", "PAN Card", "Degree/Diploma certificate", "DPR", "Bank statements"],
      source_url="https://www.msmeonline.tn.gov.in/"),

    s(slug="tn-accelerator", short_name="TN Accelerator", category="startup",
      name={
          "en": "Tamil Nadu Startup Accelerator Programme",
          "ta": "தமிழ்நாடு ஸ்டார்ட்அப் வேகமூட்டி திட்டம்",
          "hi": "तमिलनाडु स्टार्टअप एक्सेलेरेटर कार्यक्रम",
      },
      department={
          "en": "StartupTN, Government of Tamil Nadu",
          "ta": "ஸ்டார்ட்அப் தமிழ்நாடு, தமிழ்நாடு அரசு",
          "hi": "स्टार्टअपTN, तमिलनाडु सरकार",
      },
      description={
          "en": "12-week accelerator programme with grant up to ₹10 lakh, mentorship, co-working space, and investor connections for early-stage startups.",
          "ta": "இளம் ஸ்டார்ட்அப்களுக்கு ₹10 லட்சம் வரை நிதி, வழிகாட்டுதல், பணியிடம் மற்றும் முதலீட்டாளர் இணைப்புடன் 12-வார வேகமூட்டி திட்டம்.",
          "hi": "प्रारंभिक चरण के स्टार्टअप के लिए ₹10 लाख तक अनुदान, मेंटरशिप, को-वर्किंग स्पेस और निवेशक संपर्क के साथ 12-सप्ताह का कार्यक्रम।",
      },
      min_age=18, max_age=None, max_income=None, eligible_categories=CATS,
      eligible_genders=None, eligible_business_status=["new", "existing"],
      education=None,
      max_loan=1000000, interest_rate="Grant", subsidy_percent=100,
      moratorium=None, repayment_years=None,
      documents=["Aadhaar Card", "Startup registration", "Pitch deck", "Team details"],
      source_url="https://startuptn.in/"),

    s(slug="tn-industrial-policy", short_name="TN IP 2021", category="business",
      name={
          "en": "Tamil Nadu Industrial Policy 2021 Incentives",
          "ta": "தமிழ்நாடு தொழில்துறை கொள்கை 2021 ஊக்கத்தொகைகள்",
          "hi": "तमिलनाडु औद्योगिक नीति 2021 प्रोत्साहन",
      },
      department={
          "en": "Industries Department, Government of Tamil Nadu",
          "ta": "தொழில்துறை துறை, தமிழ்நாடு அரசு",
          "hi": "उद्योग विभाग, तमिलनाडु सरकार",
      },
      description={
          "en": "Capital subsidy, stamp duty exemption, electricity tax exemption, and training subsidies for new industrial units in Tamil Nadu.",
          "ta": "தமிழ்நாட்டில் புதிய தொழில் அலகுகளுக்கு மூலதன மானியம், முத்திரை வரி விலக்கு, மின் வரி விலக்கு, பயிற்சி மானியங்கள்.",
          "hi": "तमिलनाडु में नई औद्योगिक इकाइयों के लिए पूंजी सब्सिडी, स्टाम्प शुल्क छूट, बिजली कर छूट और प्रशिक्षण सब्सिडी।",
      },
      min_age=18, max_age=None, max_income=None, eligible_categories=CATS,
      eligible_genders=None, eligible_business_status=["new", "existing"],
      education=None,
      max_loan=100000000, interest_rate="As per bank", subsidy_percent=15,
      moratorium="12 months", repayment_years="10 years",
      documents=["Udyam Registration", "Detailed Project Report", "Land documents", "Environmental clearance (if required)"],
      source_url="https://www.investingintn.org/"),

    s(slug="pm-svanidhi-3", short_name="SVANidhi-3", category="business",
      name={
          "en": "PM SVANidhi — Third Tranche",
          "ta": "PM சுவநிதி — மூன்றாம் தவணை",
          "hi": "पीएम स्वनिधि — तीसरी किस्त",
      },
      department={
          "en": "Ministry of Housing & Urban Affairs",
          "ta": "வீட்டுவசதி அமைச்சகம்",
          "hi": "आवास मंत्रालय",
      },
      description={
          "en": "Enhanced loan of ₹50,000 for street vendors who repaid their first two loans on time. 7% interest subsidy continues.",
          "ta": "முதல் இரு கடன்களை சரியாக திருப்பிச் செலுத்திய தெரு வியாபாரிகளுக்கு ₹50,000 கூடுதல் கடன். 7% வட்டி மானியம் தொடர்கிறது.",
          "hi": "पहले दो ऋण समय पर चुकाने वाले फुटपाथ विक्रेताओं के लिए ₹50,000 अतिरिक्त ऋण। 7% ब्याज सब्सिडी जारी।",
      },
      min_age=18, max_age=None, max_income=None, eligible_categories=CATS,
      eligible_genders=None, eligible_business_status=["existing"],
      education=None,
      max_loan=50000, interest_rate="7% interest subsidy", subsidy_percent=7,
      moratorium=None, repayment_years="1 year",
      documents=["Aadhaar Card", "Vendor certificate", "Previous loan repayment proof"],
      source_url="https://pmsvanidhi.mohua.gov.in/"),

    s(slug="tn-msme-incentive", short_name="TN MSME", category="business",
      name={
          "en": "Tamil Nadu MSME Capital Subsidy",
          "ta": "தமிழ்நாடு MSME மூலதன மானியம்",
          "hi": "तमिलनाडु MSME पूंजी सब्सिडी",
      },
      department={
          "en": "MSME Department, Government of Tamil Nadu",
          "ta": "MSME துறை, தமிழ்நாடு அரசு",
          "hi": "MSME विभाग, तमिलनाडु सरकार",
      },
      description={
          "en": "Capital subsidy for new and expanding MSMEs in Tamil Nadu — up to 25% of eligible fixed assets with additional incentives for special categories.",
          "ta": "தமிழ்நாட்டில் புதிய மற்றும் விரிவாக்கும் MSME-களுக்கு 25% வரை மூலதன மானியம், சிறப்பு பிரிவுகளுக்கு கூடுதல் ஊக்கம்.",
          "hi": "तमिलनाडु में नए और विस्तारित MSME के लिए 25% तक पूंजी सब्सिडी, विशेष श्रेणियों के लिए अतिरिक्त प्रोत्साहन।",
      },
      min_age=18, max_age=None, max_income=None, eligible_categories=CATS,
      eligible_genders=None, eligible_business_status=["new", "existing"],
      education=None,
      max_loan=10000000, interest_rate="As per bank", subsidy_percent=25,
      moratorium="6 months", repayment_years="7 years",
      documents=["Udyam Registration", "Project report", "Bank statements", "Machinery quotations"],
      source_url="https://www.msmeonline.tn.gov.in/"),
]


def run():
    db = SessionLocal()
    added, skipped = 0, 0
    try:
        for scheme_data in SCHEMES:
            existing = (
                db.query(Scheme)
                .filter(Scheme.slug == scheme_data["slug"])
                .first()
            )
            if existing:
                skipped += 1
                continue
            db.add(Scheme(**scheme_data))
            added += 1
        db.commit()
        total = db.query(Scheme).count()
        print(f"[OK] Added: {added}, Skipped: {skipped}")
        print(f"[OK] Total schemes in DB: {total}")
    finally:
        db.close()


if __name__ == "__main__":
    run()
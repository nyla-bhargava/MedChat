
import { toast } from "@/components/ui/sonner";
import { findRelevantCluster } from "./medicalKnowledge";

// Type definitions
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Content moderation check to filter out prohibited medical content
const checkContentSafety = (message: string): boolean => {
  const prohibitedPatterns = [
    /\b(suicide|kill myself|end my life)\b/i,
    /\b(make|create|build|synthesize)\s+\b(bomb|explosive|weapon|poison|drug)/i,
    /\b(prescription|drug)\s+\b(buy|purchase|order|shop|sale)/i
  ];

  return !prohibitedPatterns.some(pattern => pattern.test(message));
};

// Medical context generation
const generateMedicalContext = (gender?: string, ageRange?: string): string => {
  let context = "";
  
  if (gender || ageRange) {
    context = "User context: ";
    if (gender) context += `Gender: ${gender}. `;
    if (ageRange) context += `Age range: ${ageRange}. `;
  }
  
  return context;
};

// List of Gale Encyclopedia volumes used for information
const galeReferences = [
  "Gale Encyclopedia of Medicine",
  "Gale Encyclopedia of Public Health",
  "Gale Encyclopedia of Alternative Medicine",
  "Gale Encyclopedia of Nursing and Allied Health",
  "Gale Encyclopedia of Genetic Disorders",
  "Gale Encyclopedia of Children's Health",
  "Gale Encyclopedia of Prescription Drugs"
];

// Get a random Gale Encyclopedia volume to cite
const getRandomGaleReference = (): string => {
  const randomIndex = Math.floor(Math.random() * galeReferences.length);
  return galeReferences[randomIndex];
};

// Generate a medically-focused answer based on the query type
const generateMedicalAnswer = (query: string, medicalContext: string): { answer: string, source: string } => {
  // Determine the most relevant medical cluster for this query
  const relevantCluster = findRelevantCluster(query);
  
  // Select a Gale reference to cite
  const referenceBook = getRandomGaleReference();
  
  // Convert query to lowercase for easier matching
  const queryLower = query.toLowerCase();
  
  // Extract topic from query for more general queries
  const extractMainTopic = (query: string): string => {
    // Try to identify the main medical topic in the query
    const commonTopics = [
      "headache", "migraine", "pain", "fever", "cold", "flu", "covid", "coronavirus", 
      "diabetes", "heart", "blood pressure", "hypertension", "allergy", "asthma", 
      "sleep", "insomnia", "diet", "nutrition", "exercise", "anxiety", "depression", 
      "stress", "pregnancy", "vitamin", "supplement", "vaccination", "vaccine",
      "arthritis", "joint pain", "digestion", "stomach", "skin", "rash", "cancer",
      "cholesterol", "thyroid", "kidney", "liver", "lung", "eye", "ear", "throat"
    ];
    
    for (const topic of commonTopics) {
      if (queryLower.includes(topic)) {
        return topic;
      }
    }
    
    // If no specific topic is found, return empty
    return "";
  };
  
  const mainTopic = extractMainTopic(queryLower);
  
  // Specific response mappings based on topic
  if (queryLower.includes("headache") || queryLower.includes("migraine")) {
    return {
      answer: `${medicalContext}## Headaches & Migraines

**Description:**
Headaches are pain sensations felt in the head region, while migraines are a specific type of recurring headache that typically presents with moderate to severe throbbing pain, often on one side of the head.

**Common Causes:**
- **Tension headaches:** Stress, poor posture, eye strain
- **Migraines:** Genetic factors, hormonal changes, certain foods, environmental triggers
- **Cluster headaches:** Unknown causes, possibly hypothalamic abnormalities
- **Secondary headaches:** Dehydration, medication overuse, sinus infections, concussion

**Diagnosis:**
Diagnosis is primarily clinical, based on:
- Detailed medical history
- Pattern and character of headaches
- Physical and neurological examination
- In some cases, imaging (CT, MRI) if red flags are present

**Treatment Options:**
1. **Non-pharmacological:**
   - Rest in a quiet, dark room
   - Cold or warm compresses
   - Stress management techniques
   - Regular sleep schedule
   - Trigger avoidance

2. **Medications:**
   - **For tension headaches:** Acetaminophen, NSAIDs
   - **For migraines:** 
     - Acute: Triptans, NSAIDs, anti-nausea medications
     - Preventive: Beta-blockers, anticonvulsants, CGRP antagonists

**When to Seek Medical Attention:**
- Sudden, severe "thunderclap" headache
- Headache with fever, neck stiffness, confusion
- Headache after head injury
- New headache in someone over 50
- Headache with vision changes or weakness

**Please consult a licensed healthcare provider for diagnosis or treatment.**`,
      source: "Gale Encyclopedia of Neurological Disorders"
    };
  } 
  else if (queryLower.includes("cold") || queryLower.includes("flu")) {
    return {
      answer: `${medicalContext}## Common Cold vs. Influenza (Flu)

**Description:**
Both are respiratory infections, but they have different causes, symptoms, severity levels, and potential complications.

**Common Cold:**
- **Causative Agent:** Various viruses (primarily rhinoviruses)
- **Incubation Period:** 1-3 days

**Influenza (Flu):**
- **Causative Agent:** Influenza viruses (types A, B, C)
- **Incubation Period:** 1-4 days

**Symptom Comparison:**

| Symptom | Common Cold | Influenza |
|---------|-------------|-----------|
| Onset | Gradual | Sudden and rapid |
| Fever | Rare or low-grade | Common, higher (100-104°F), lasts 3-4 days |
| Fatigue | Mild | Severe, can last 2-3 weeks |
| Headache | Uncommon | Common and often severe |
| Body aches | Mild | Common and often severe |
| Cough | Mild to moderate | Common, can become severe |
| Sore throat | Common | Sometimes |
| Runny/stuffy nose | Very common | Sometimes |
| Sneezing | Common | Sometimes |

**Diagnosis:**
- Primarily clinical based on symptoms
- Rapid influenza diagnostic tests available for flu
- PCR testing for more accurate diagnosis

**Treatment:**
1. **Common Cold:**
   - Symptomatic treatment (rest, fluids, OTC decongestants)
   - No specific antiviral therapy

2. **Influenza:**
   - Antiviral medications if started within 48 hours (oseltamivir, zanamivir)
   - Symptomatic treatment
   - Rest and hydration

**Prevention:**
- Hand washing
- Avoiding close contact with infected individuals
- Annual flu vaccination (for influenza)
- Masking in high-transmission settings

**Complications:**
- **Common Cold:** Usually self-limiting; occasionally sinusitis or ear infections
- **Influenza:** Can lead to pneumonia, myocarditis, encephalitis, multi-organ failure, especially in high-risk groups

**Please consult a licensed healthcare provider for diagnosis or treatment.**`,
      source: "Gale Encyclopedia of Infectious Diseases"
    };
  }
  else if (queryLower.includes("covid") || queryLower.includes("coronavirus")) {
    return {
      answer: `${medicalContext}## COVID-19 (Coronavirus Disease 2019)

**Description:**
COVID-19 is an infectious disease caused by the SARS-CoV-2 virus that primarily affects the respiratory system, though it can impact multiple organ systems.

**Causative Agent:**
- SARS-CoV-2 (Severe Acute Respiratory Syndrome Coronavirus 2)
- RNA virus belonging to the coronavirus family

**Transmission:**
- Respiratory droplets and aerosols
- Close contact with infected individuals
- Contact with contaminated surfaces (less common)
- Potential airborne transmission in enclosed spaces

**Incubation Period:**
- 2-14 days (average 5-6 days)

**Clinical Presentation:**
**Common Symptoms:**
- Fever or chills
- Cough
- Shortness of breath
- Fatigue
- Muscle/body aches
- Headache
- Loss of taste/smell
- Sore throat
- Congestion or runny nose
- Nausea or vomiting
- Diarrhea

**Severity Spectrum:**
- Asymptomatic (no symptoms)
- Mild to moderate disease
- Severe disease requiring hospitalization
- Critical disease with respiratory failure, shock, or multi-organ dysfunction

**Diagnosis:**
- PCR testing (nasopharyngeal swab)
- Rapid antigen testing
- Antibody testing (indicates past infection)
- Chest imaging in more severe cases

**Treatment:**
- **Mild Cases:** Symptomatic treatment, rest, hydration
- **Moderate to Severe Cases:**
  - Antiviral therapy (e.g., nirmatrelvir-ritonavir, remdesivir)
  - Immunomodulators (e.g., dexamethasone, baricitinib)
  - Monoclonal antibodies for high-risk patients
  - Supportive care including oxygen therapy
  - Anticoagulation if indicated

**Prevention:**
- Vaccination
- Proper hand hygiene
- Mask wearing in high-risk settings
- Physical distancing
- Adequate ventilation in indoor spaces

**Complications:**
- Pneumonia
- Acute respiratory distress syndrome (ARDS)
- Cardiovascular complications (myocarditis, arrhythmias)
- Thromboembolic events
- Long COVID (persistent symptoms lasting weeks to months)
- Multisystem inflammatory syndrome (MIS)

**When to Seek Emergency Care:**
- Difficulty breathing
- Persistent chest pain or pressure
- New confusion
- Inability to wake or stay awake
- Bluish lips or face

**Please consult a licensed healthcare provider for diagnosis or treatment.**`,
      source: "Gale Encyclopedia of Emerging Infectious Diseases"
    };
  }
  
  // Additional conditions from our medical knowledge base
  else if (relevantCluster) {
    switch(relevantCluster.id) {
      case 'cardiovascular':
        if (queryLower.includes('blood pressure') || queryLower.includes('hypertension')) {
          return {
            answer: `${medicalContext}## Hypertension (High Blood Pressure)

**Description:**
Hypertension is a chronic medical condition characterized by persistently elevated blood pressure in the arteries, typically defined as readings of 130/80 mmHg or higher. It is often called the "silent killer" because it typically causes no symptoms while progressively damaging the heart, blood vessels, kidneys, and other organs.

**Blood Pressure Classifications (Adults):**

| Category | Systolic BP (mmHg) | Diastolic BP (mmHg) |
|----------|-------------------|---------------------|
| Normal | <120 | and <80 |
| Elevated | 120-129 | and <80 |
| Stage 1 Hypertension | 130-139 | or 80-89 |
| Stage 2 Hypertension | ≥140 | or ≥90 |
| Hypertensive Crisis | >180 | and/or >120 |

**Types of Hypertension:**
1. **Primary (Essential) Hypertension:**
   - No identifiable cause
   - Develops gradually over years
   - Accounts for 90-95% of cases

2. **Secondary Hypertension:**
   - Results from an identifiable underlying condition
   - Causes include kidney disease, adrenal disorders, thyroid problems, sleep apnea, and certain medications

**Risk Factors:**
- Age (risk increases with age)
- Family history
- Race/ethnicity (higher prevalence in Black populations)
- Obesity and excess weight
- Sedentary lifestyle
- Tobacco use
- High sodium diet
- Excessive alcohol consumption
- Chronic stress
- Certain chronic conditions (diabetes, kidney disease)

**Symptoms:**
- Usually asymptomatic ("silent killer")
- In severe cases or hypertensive crisis:
  - Headaches (particularly in the morning)
  - Shortness of breath
  - Nosebleeds
  - Visual changes
  - Chest pain
  - Dizziness

**Complications:**
- Heart attack and heart failure
- Stroke
- Aneurysm
- Chronic kidney disease
- Vascular dementia
- Retinopathy and vision loss
- Peripheral artery disease

**Treatment Approach:**
1. **Lifestyle modifications:**
   - DASH diet (Dietary Approaches to Stop Hypertension)
   - Reduced sodium intake (<2300 mg/day)
   - Regular physical activity (150+ min/week)
   - Weight management
   - Limited alcohol consumption
   - Smoking cessation
   - Stress management

2. **Pharmacotherapy:**
   - Thiazide diuretics
   - Angiotensin-converting enzyme (ACE) inhibitors
   - Angiotensin II receptor blockers (ARBs)
   - Calcium channel blockers
   - Beta-blockers

**Please consult a licensed healthcare provider for diagnosis or treatment.**`,
            source: "Gale Encyclopedia of Cardiovascular Diseases and Disorders"
          };
        }
        else if (queryLower.includes('cholesterol')) {
          return {
            answer: `${medicalContext}## Managing Cholesterol Levels

**Description:**
Cholesterol is a waxy, fat-like substance found in all cells of the body. While necessary for normal body function, elevated blood cholesterol levels can lead to atherosclerosis and increase risk for cardiovascular disease.

**Types of Cholesterol:**

| Type | Description | Target Levels |
|------|-------------|---------------|
| Total Cholesterol | Sum of all cholesterol in blood | <200 mg/dL (desirable) |
| LDL Cholesterol | "Bad" cholesterol that builds up in arteries | <100 mg/dL (optimal) |
| HDL Cholesterol | "Good" cholesterol that helps remove LDL | >60 mg/dL (protective) |
| Triglycerides | Another type of fat in the bloodstream | <150 mg/dL (normal) |

**Risk Factors for High Cholesterol:**
- Family history (genetic hypercholesterolemia)
- Diet high in saturated and trans fats
- Obesity
- Sedentary lifestyle
- Age and gender
- Medical conditions (diabetes, hypothyroidism, liver/kidney disease)
- Medications (steroids, some birth control pills)

**Assessment and Diagnosis:**
- Fasting lipid panel blood test
- Assessment of total cardiovascular risk using risk calculators
- Family history evaluation
- Physical examination for signs of hypercholesterolemia

**Treatment Approaches:**
1. **Therapeutic Lifestyle Changes:**
   - Heart-healthy diet low in saturated/trans fats
   - Regular physical activity (at least 150 minutes/week)
   - Weight management
   - Smoking cessation
   - Limited alcohol consumption

2. **Dietary Recommendations:**
   - Increase soluble fiber (oats, beans, fruits)
   - Plant stanols and sterols
   - Omega-3 fatty acids (fatty fish, flaxseed)
   - Reduced intake of animal products high in saturated fat

3. **Pharmacotherapy:**
   - **Statins:** First-line therapy (e.g., atorvastatin, rosuvastatin)
   - **PCSK9 inhibitors:** For severe cases or statin intolerance
   - **Ezetimibe:** Blocks cholesterol absorption in intestines
   - **Bile acid sequestrants:** Bind bile acids, reducing cholesterol
   - **Fibrates:** Primarily for triglyceride reduction

**Monitoring:**
- Regular lipid panel testing (initially 6-12 weeks after treatment)
- Liver function testing with statin therapy
- Reassessment of cardiovascular risk periodically

**Complications of Untreated Hypercholesterolemia:**
- Coronary artery disease/heart attack
- Stroke
- Peripheral artery disease
- Carotid artery disease
- Xanthomas (cholesterol deposits in skin/tendons)

**Please consult a licensed healthcare provider for diagnosis or treatment.**`,
            source: "Gale Encyclopedia of Cardiovascular Health"
          };
        }
        break;
        
      case 'endocrine':
        if (queryLower.includes('diabetes')) {
          return {
            answer: `${medicalContext}## Diabetes Mellitus

**Description:**
Diabetes mellitus is a group of metabolic disorders characterized by chronically elevated blood glucose levels (hyperglycemia) due to defects in insulin secretion, insulin action, or both.

**Major Types:**

1. **Type 1 Diabetes:**
   - Autoimmune destruction of pancreatic beta cells resulting in absolute insulin deficiency
   - Usually diagnosed in children and young adults
   - Requires lifelong insulin therapy
   - Accounts for 5-10% of diabetes cases
   - Rapid onset of symptoms

2. **Type 2 Diabetes:**
   - Progressive insulin secretory defect on the background of insulin resistance
   - Most common form (90-95% of cases)
   - Strong association with obesity and physical inactivity
   - Often develops gradually over years
   - May be managed with lifestyle modifications, oral medications, and/or insulin

3. **Gestational Diabetes:**
   - Glucose intolerance with onset or first recognition during pregnancy
   - Risk factor for future development of type 2 diabetes
   - Usually resolves after delivery but requires monitoring

**Diagnostic Criteria:**
| Test | Normal | Prediabetes | Diabetes |
|------|--------|-------------|----------|
| Fasting Plasma Glucose | <100 mg/dL | 100-125 mg/dL | ≥126 mg/dL |
| 2-hr Plasma Glucose (OGTT) | <140 mg/dL | 140-199 mg/dL | ≥200 mg/dL |
| HbA1c | <5.7% | 5.7-6.4% | ≥6.5% |
| Random Plasma Glucose | - | - | ≥200 mg/dL + symptoms |

**Classic Symptoms:**
- Polyuria (increased urination)
- Polydipsia (increased thirst)
- Polyphagia (increased hunger)
- Unexplained weight loss (especially in type 1)
- Fatigue
- Blurred vision
- Slow-healing wounds
- Frequent infections

**Acute Complications:**
- Diabetic ketoacidosis (DKA) - primarily in Type 1
- Hyperosmolar hyperglycemic state (HHS) - primarily in Type 2
- Hypoglycemia (often medication-related)

**Chronic Complications:**
- **Microvascular:**
  - Diabetic retinopathy (leading cause of blindness)
  - Diabetic nephropathy (leading cause of kidney failure)
  - Diabetic neuropathy (nerve damage)
- **Macrovascular:**
  - Coronary artery disease
  - Peripheral arterial disease
  - Cerebrovascular disease

**Management:**
1. **Blood Glucose Monitoring:**
   - Self-monitoring of blood glucose
   - Continuous glucose monitoring systems
   - Regular HbA1c testing (every 3-6 months)

2. **Lifestyle Modifications:**
   - Medical nutrition therapy
   - Regular physical activity
   - Weight management
   - Smoking cessation
   - Stress management

3. **Pharmacotherapy:**
   - **Type 1:** Insulin therapy (multiple daily injections or insulin pump)
   - **Type 2:**
     - Metformin (usually first-line)
     - Sulfonylureas
     - DPP-4 inhibitors
     - SGLT2 inhibitors
     - GLP-1 receptor agonists
     - Thiazolidinediones
     - Insulin when needed

**Please consult a licensed healthcare provider for diagnosis or treatment.**`,
            source: "Gale Encyclopedia of Endocrinology and Metabolic Disorders"
          };
        } 
        else if (queryLower.includes('thyroid')) {
          return {
            answer: `${medicalContext}## Thyroid Disorders

**Description:**
The thyroid is a butterfly-shaped gland in the neck that produces hormones regulating metabolism, growth, and energy expenditure. Thyroid disorders affect the structure or function of the thyroid gland and are among the most common endocrine disorders worldwide.

**Major Thyroid Disorders:**

1. **Hypothyroidism:**
   - Underactive thyroid not producing enough thyroid hormone
   - Most common cause: Hashimoto's thyroiditis (autoimmune)
   - Affects approximately 5% of population, more common in women
   - Symptoms: fatigue, cold sensitivity, weight gain, dry skin, constipation, depression, menstrual irregularities, bradycardia
   - Treatment: Thyroid hormone replacement (levothyroxine)

2. **Hyperthyroidism:**
   - Overactive thyroid producing excess thyroid hormone
   - Most common cause: Graves' disease (autoimmune)
   - Affects approximately 1% of population
   - Symptoms: weight loss, tachycardia, anxiety, tremors, heat intolerance, sleep disturbances, exophthalmos (in Graves')
   - Treatment: Antithyroid medications, radioactive iodine, surgery

3. **Thyroid Nodules:**
   - Abnormal growths of thyroid cells forming lumps
   - Very common (up to 50% of people have them by age 60)
   - Most are benign (90-95%), remainder are malignant
   - Often asymptomatic unless large enough to cause compression
   - Evaluation: Ultrasound, fine needle aspiration biopsy

4. **Thyroiditis:**
   - Inflammation of the thyroid gland
   - Types include Hashimoto's, postpartum, subacute, silent
   - May cause temporary hyperthyroidism followed by hypothyroidism
   - Management depends on type and severity

**Diagnostic Tests:**

| Test | Purpose | Normal Range |
|------|---------|-------------|
| TSH | Primary screening test | 0.4-4.0 mIU/L |
| Free T4 | Active thyroid hormone | 0.8-1.8 ng/dL |
| Free T3 | Most potent thyroid hormone | 2.3-4.2 pg/mL |
| Thyroid Antibodies | Detect autoimmune conditions | Varies by antibody type |
| Ultrasound | Evaluate nodules and structure | Not applicable |

**Risk Factors:**
- Female gender (5-8 times higher risk)
- Family history of thyroid disease
- Personal history of autoimmune disease
- Radiation exposure to neck
- Age (risk increases with age)
- Iodine deficiency or excess
- Recent pregnancy
- Certain medications

**Special Considerations:**
- **Pregnancy:** Thyroid function affects fetal development; requires close monitoring
- **Elderly:** May present with atypical symptoms; treatment requires careful titration
- **Subclinical disease:** Mild lab abnormalities without symptoms; treatment controversial

**Complications of Untreated Thyroid Disease:**
- **Hypothyroidism:** Myxedema coma (life-threatening), cardiovascular disease, infertility, neurological damage
- **Hyperthyroidism:** Thyroid storm (medical emergency), heart failure, osteoporosis, eye damage

**Please consult a licensed healthcare provider for diagnosis or treatment.**`,
            source: "Gale Encyclopedia of Endocrine Disorders"
          };
        }
        break;
        
      case 'musculoskeletal':
        if (queryLower.includes('arthritis') || queryLower.includes('joint pain')) {
          return {
            answer: `${medicalContext}## Arthritis & Joint Pain

**Description:**
Arthritis is inflammation of one or more joints, causing pain, stiffness, and decreased range of motion that typically worsens with age. There are over 100 types of arthritis, affecting different joints and tissues.

**Major Types:**

1. **Osteoarthritis (OA):**
   - Most common form (affects over 32.5 million US adults)
   - Degenerative "wear and tear" arthritis
   - Progressive loss of cartilage between bones
   - Typically affects weight-bearing joints (knees, hips, spine) and hands
   - Risk increases with age, joint injury, obesity, and genetics
   - Characterized by joint pain that worsens with activity and improves with rest

2. **Rheumatoid Arthritis (RA):**
   - Autoimmune disease (affects ~1.5 million US adults)
   - Body attacks its own joint lining (synovium)
   - Symmetric involvement (affects same joints on both sides)
   - Often affects smaller joints first (hands, wrists)
   - Can damage multiple organs, not just joints
   - Characterized by morning stiffness lasting >1 hour and systemic symptoms

3. **Psoriatic Arthritis:**
   - Inflammatory arthritis associated with psoriasis
   - Affects 10-30% of people with psoriasis
   - Can cause "sausage digits" (dactylitis) and nail changes
   - May affect spine (spondylitis)
   - Asymmetric joint involvement typical

4. **Gout:**
   - Metabolic arthritis from uric acid crystal deposition
   - Sudden, severe attacks of pain, redness, swelling
   - Often affects the big toe joint first (podagra)
   - Associated with diet, genetics, and alcohol consumption
   - Recurrent attacks can lead to chronic arthritis and tophi

**Symptoms by Arthritis Type:**

| Feature | Osteoarthritis | Rheumatoid Arthritis | Gout |
|---------|----------------|----------------------|------|
| Pain onset | Gradual | Can be sudden | Sudden, often at night |
| Joint pattern | Asymmetric, weight-bearing | Symmetric, small joints first | Usually monoarticular initially |
| Morning stiffness | <30 minutes | >1 hour | Variable |
| Swelling | Mild to moderate | Often pronounced | Severe, red, hot |
| Systemic symptoms | Rare | Fatigue, fever, weight loss | Fever possible during attacks |
| Key diagnostic findings | Joint space narrowing, osteophytes | Rheumatoid factor, anti-CCP antibodies | Elevated uric acid, crystal identification |

**Treatment Approaches:**
1. **Non-pharmacological:**
   - Physical therapy and appropriate exercise
   - Weight management (crucial for knee/hip OA)
   - Heat and cold therapy
   - Assistive devices
   - Joint protection techniques
   - Appropriate footwear and orthotics

2. **Medications:**
   - **For OA:** Acetaminophen, NSAIDs, topical agents, intra-articular injections
   - **For RA:** NSAIDs, conventional DMARDs (methotrexate), biologics, JAK inhibitors
   - **For Gout:** NSAIDs, colchicine, corticosteroids (acute); allopurinol, febuxostat (chronic)
   - **For Psoriatic Arthritis:** NSAIDs, DMARDs, biologics (especially TNF and IL-17 inhibitors)

3. **Surgical options:**
   - Joint replacement (arthroplasty)
   - Arthroscopy
   - Joint fusion (arthrodesis)
   - Synovectomy

**Please consult a licensed healthcare provider for diagnosis or treatment.**`,
            source: "Gale Encyclopedia of Rheumatology and Musculoskeletal Disorders"
          };
        }
        break;
        
      case 'mental_health':
        if (queryLower.includes('anxiety') || queryLower.includes('depression')) {
          return {
            answer: `${medicalContext}## Anxiety & Depression Disorders

**Description:**
Anxiety and depression are common mental health conditions that affect mood, thoughts, and physical well-being. They often co-occur and can significantly impact daily functioning and quality of life.

**Anxiety Disorders:**

1. **Generalized Anxiety Disorder (GAD):**
   - Persistent, excessive worry about various things
   - Difficulty controlling worry
   - Affects ~6.8 million US adults
   - Physical symptoms: restlessness, fatigue, difficulty concentrating, irritability, muscle tension, sleep disturbance
   - Duration: symptoms present more days than not for at least 6 months

2. **Panic Disorder:**
   - Recurrent unexpected panic attacks
   - Persistent concern about additional attacks
   - Significant behavioral changes related to attacks
   - Physical symptoms: heart palpitations, sweating, trembling, shortness of breath, chest pain, nausea, dizziness
   - Often has genetic component

3. **Social Anxiety Disorder:**
   - Intense fear of social or performance situations
   - Fear of negative evaluation by others
   - Avoidance of social situations
   - Physical symptoms in social settings: blushing, sweating, trembling
   - Typically begins in adolescence

**Depressive Disorders:**

1. **Major Depressive Disorder (MDD):**
   - Persistent low mood, sadness, or emptiness
   - Loss of interest or pleasure in activities
   - Changes in appetite, sleep, energy
   - Affects ~21 million US adults
   - Episodes typically last 6-8 months without treatment
   - High risk of recurrence (50% after one episode, 80% after two)

2. **Persistent Depressive Disorder (Dysthymia):**
   - Chronic low-grade depression lasting at least 2 years
   - Less severe but more persistent than MDD
   - Often begins in adolescence or early adulthood
   - Significant impact on quality of life due to chronicity

3. **Seasonal Affective Disorder (SAD):**
   - Depression related to seasonal changes
   - Typically begins in fall/winter and resolves in spring/summer
   - Associated with reduced daylight exposure
   - More common in northern latitudes

**Key Diagnostic Features:**

| Feature | Anxiety Disorders | Depressive Disorders |
|---------|-------------------|----------------------|
| Primary emotion | Fear, worry, apprehension | Sadness, emptiness, hopelessness |
| Cognitive pattern | Future-oriented concern, catastrophizing | Negative views of self/world/future, rumination |
| Energy levels | Often agitated or restless | Typically fatigue and lethargy |
| Sleep patterns | Difficulty falling asleep | Early morning awakening, hypersomnia |
| Risk assessment | Self-harm rare but possible | Higher risk of suicidal ideation |

**Treatment Approaches:**
1. **Psychotherapy:**
   - Cognitive-Behavioral Therapy (CBT) - first-line for both
   - Exposure therapy (for anxiety disorders)
   - Interpersonal therapy (for depression)
   - Mindfulness-Based Cognitive Therapy (MBCT)
   - Acceptance and Commitment Therapy (ACT)

2. **Medications:**
   - **First-line for both:** SSRIs (sertraline, escitalopram), SNRIs (venlafaxine, duloxetine)
   - **For anxiety:** Buspirone, pregabalin; benzodiazepines (short-term only)
   - **For depression:** Bupropion, mirtazapine, atypical antipsychotics (adjunctive)
   - **Treatment-resistant options:** Ketamine, ECT, TMS

3. **Lifestyle modifications:**
   - Regular physical activity (strong evidence for effectiveness)
   - Sleep hygiene
   - Stress management techniques
   - Social support
   - Limited caffeine and alcohol
   - Balanced nutrition

**Warning Signs Requiring Immediate Attention:**
- Suicidal thoughts or behaviors
- Inability to care for oneself
- Psychotic symptoms
- Severe functional impairment

**Please consult a licensed healthcare provider for diagnosis or treatment.**`,
            source: "Gale Encyclopedia of Mental Health"
          };
        }
        break;
        
      case 'dermatological':
        if (queryLower.includes('skin') || queryLower.includes('rash')) {
          return {
            answer: `${medicalContext}## Common Skin Conditions & Rashes

**Description:**
The skin is the body's largest organ and serves as a protective barrier against environmental factors. Skin conditions can range from mild, temporary issues to severe, chronic diseases affecting quality of life.

**Common Skin Conditions:**

1. **Contact Dermatitis:**
   - Inflammation caused by direct contact with an allergen or irritant
   - Presents as red, itchy rash, sometimes with blisters
   - Appears within hours to days after exposure
   - Common triggers: metals (nickel), plants (poison ivy), chemicals, cosmetics
   - Treatment: Avoiding trigger, topical steroids, antihistamines

2. **Atopic Dermatitis (Eczema):**
   - Chronic inflammatory condition with genetic component
   - Characterized by dry, itchy patches, often in flexural areas
   - Often begins in childhood, may improve with age
   - Associated with asthma and allergic rhinitis ("atopic triad")
   - Treatment: Moisturizers, topical anti-inflammatories, trigger avoidance

3. **Psoriasis:**
   - Immune-mediated condition causing rapid skin cell turnover
   - Presents as well-demarcated, thick, red plaques with silvery scales
   - Common locations: elbows, knees, scalp, lower back
   - Can be triggered by stress, injury, medications, infections
   - Treatment: Topical treatments, phototherapy, systemic medications, biologics

4. **Acne Vulgaris:**
   - Inflammatory condition of the pilosebaceous units
   - Causes comedones, papules, pustules, nodules
   - Primarily affects adolescents but can persist into adulthood
   - Influenced by hormones, genetics, and P. acnes bacteria
   - Treatment: Topical retinoids, benzoyl peroxide, antibiotics, isotretinoin for severe cases

5. **Rosacea:**
   - Chronic inflammatory condition affecting the central face
   - Presents with flushing, persistent redness, papules, pustules
   - Typically affects adults 30-50 years old
   - May include eye symptoms and tissue hyperplasia (rhinophyma)
   - Treatment: Trigger avoidance, topical and oral antibiotics, laser therapy

**Key Characteristics of Common Rashes:**

| Condition | Appearance | Distribution | Associated Symptoms |
|-----------|------------|--------------|---------------------|
| Hives (Urticaria) | Raised, red, itchy welts | Can appear anywhere, transient | Often allergic reaction, may include angioedema |
| Tinea (Ringworm) | Circular, scaly patches with raised borders | Anywhere on body, named by location (e.g., tinea pedis - feet) | Itching, burning |
| Shingles (Herpes Zoster) | Painful, blistering rash | Follows a dermatome, unilateral | Prodromal pain, post-herpetic neuralgia |
| Scabies | Tiny burrows, papules, intense itching | Web spaces of fingers, wrists, axillae, groin | Worse at night, often affects multiple household members |

**Diagnostic Approach:**
- Clinical examination of lesion morphology, distribution, and pattern
- Patient history including onset, duration, symptoms, exposures
- Skin scraping/KOH preparation for fungal infections
- Patch testing for allergic contact dermatitis
- Skin biopsy for uncertain diagnoses or suspected malignancies

**When to Seek Medical Care:**
- Rapidly spreading rash
- Rash accompanied by fever
- Painful rash or skin condition
- Signs of infection (increasing redness, warmth, swelling, pus)
- Rash that doesn't improve with over-the-counter treatments
- Any changing mole or new growth (ABCDE rule for melanoma)

**Please consult a licensed healthcare provider for diagnosis or treatment.**`,
            source: "Gale Encyclopedia of Dermatology"
          };
        }
        break;
      
      default:
        // Generic response for other clusters
        return {
          answer: `${medicalContext}## Medical Information: ${relevantCluster.name}

Based on your query about ${mainTopic || "this medical topic"}, here is relevant medical information from trusted sources:

**Key Medical Concepts:**
- ${relevantCluster.name} include various conditions that affect ${relevantCluster.description.toLowerCase()}
- Proper diagnosis typically requires professional medical evaluation
- Treatment approaches often include both lifestyle modifications and specific medical interventions
- Regular monitoring is important for managing chronic conditions

**Important Health Considerations:**
- Symptoms of ${relevantCluster.name.toLowerCase()} may include changes in function, pain, or other specific manifestations
- Risk factors often include genetic predisposition, environmental factors, and lifestyle choices
- Early detection and appropriate management can significantly improve outcomes
- Following treatment plans as prescribed by healthcare providers is essential

**When to Seek Medical Attention:**
- New, severe, or worsening symptoms
- Symptoms that interfere with daily activities
- Signs of complications or progression
- Before starting any new treatments or supplements

For specific guidance regarding your health concerns related to ${relevantCluster.name.toLowerCase()}, consultation with a qualified healthcare provider is recommended.

**Please consult a licensed healthcare provider for diagnosis or treatment.**`,
          source: relevantCluster.name ? `Gale Encyclopedia of ${relevantCluster.name}` : referenceBook
        };
    }
  }
  else {
    // Generic response for queries that don't match any specific topic or cluster
    return {
      answer: `${medicalContext}## Medical Information

Based on your query, here is general medical information from trusted sources:

**Key Medical Concepts:**
- Medical conditions vary widely in their causes, presentations, and treatments
- Proper diagnosis typically requires professional medical evaluation
- Treatment approaches often include both lifestyle modifications and medical interventions
- Prevention is generally more effective than treatment for many conditions

**Important Health Considerations:**
- Regular health screenings appropriate for your age and risk factors are recommended
- Balanced nutrition and regular physical activity support overall health
- Adequate sleep and stress management contribute to wellbeing
- Following medication instructions precisely is important for efficacy and safety

**General Wellness Guidelines:**
- Maintain a balanced diet rich in fruits, vegetables, and whole grains
- Engage in regular physical activity (at least 150 minutes of moderate exercise weekly)
- Get adequate sleep (7-9 hours for most adults)
- Manage stress through relaxation techniques, mindfulness, or other activities
- Stay current with recommended vaccinations and health screenings
- Avoid tobacco and limit alcohol consumption

For specific guidance regarding your health concerns, consultation with a qualified healthcare provider is recommended.

**Please consult a licensed healthcare provider for diagnosis or treatment.**`,
      source: referenceBook
    };
  }
};

// Simulate API call to Gemini
export const sendMessageToGemini = async (message: string, messageHistory: ChatMessage[]): Promise<string> => {
  // In production, replace with actual Gemini API call
  // For now, simulate API call with delay
  
  // Content safety check
  if (!checkContentSafety(message)) {
    return "I'm sorry, but I cannot provide information on that topic. Please ask about general health information or consult a licensed medical professional.";
  }
  
  try {
    // In a real implementation, this is where you'd make the API call to Gemini
    // const response = await fetch('YOUR_GEMINI_API_ENDPOINT', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     messages: [...messageHistory.map(msg => ({
    //       role: msg.role,
    //       content: msg.content
    //     })), {
    //       role: 'user',
    //       content: message
    //     }],
    //     systemPrompt: "You are MediBot, a helpful, empathetic AI medical assistant. You provide safe, accurate, and clear information to health-related queries based on established medical textbooks. You do not diagnose or prescribe. If a question is unclear or too vague, ask for clarification. For emergencies, advise consulting a licensed doctor.",
    //   })
    // });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500));
    
    // Get user context from localStorage
    const gender = localStorage.getItem('medibot-user-gender');
    const ageRange = localStorage.getItem('medibot-user-age');
    const medicalContext = generateMedicalContext(gender || undefined, ageRange || undefined);
    
    // Generate medical answer based on query
    const { answer, source } = generateMedicalAnswer(message, medicalContext);
    
    // Add citation
    const referenceCitation = `\n\n*Source: Based on information from ${source}*`;
    
    return answer + referenceCitation;
    
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    toast.error("Failed to get a response. Please try again.");
    return "I'm having trouble connecting right now. Please try again in a moment.";
  }
};

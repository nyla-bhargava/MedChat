
// This file represents how medical knowledge would be organized in a real implementation.
// In a production system, this would be derived from actual Gale Encyclopedia content.

export type MedicalCluster = {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  entries: string[]; // Would contain IDs or references to actual encyclopedia entries
}

// Example of how medical content would be clustered
export const medicalClusters: MedicalCluster[] = [
  {
    id: 'respiratory',
    name: 'Respiratory Disorders',
    description: 'Conditions affecting the lungs and breathing pathways',
    keywords: ['lung', 'breathing', 'respiratory', 'asthma', 'pneumonia', 'bronchitis', 'covid', 'flu', 'cold'],
    entries: ['asthma', 'pneumonia', 'bronchitis', 'common_cold', 'influenza', 'covid19', 'tuberculosis']
  },
  {
    id: 'cardiovascular',
    name: 'Cardiovascular Disorders',
    description: 'Conditions affecting the heart and blood vessels',
    keywords: ['heart', 'blood pressure', 'cardiovascular', 'hypertension', 'cholesterol', 'stroke', 'cardiac'],
    entries: ['hypertension', 'coronary_artery_disease', 'heart_failure', 'arrhythmia', 'hyperlipidemia', 'stroke']
  },
  {
    id: 'neurological',
    name: 'Neurological Disorders',
    description: 'Conditions affecting the brain, spinal cord, and nerves',
    keywords: ['brain', 'nerve', 'neurological', 'migraine', 'headache', 'epilepsy', 'alzheimer', 'parkinson'],
    entries: ['migraine', 'epilepsy', 'parkinsons_disease', 'alzheimers_disease', 'multiple_sclerosis']
  },
  {
    id: 'digestive',
    name: 'Digestive System Disorders',
    description: 'Conditions affecting the digestive tract and organs',
    keywords: ['stomach', 'intestine', 'digestive', 'ibs', 'gastritis', 'ulcer', 'liver', 'gallbladder'],
    entries: ['gerd', 'peptic_ulcer', 'irritable_bowel_syndrome', 'crohns_disease', 'ulcerative_colitis', 'cirrhosis']
  },
  {
    id: 'endocrine',
    name: 'Endocrine Disorders',
    description: 'Conditions affecting hormone-producing glands',
    keywords: ['hormone', 'endocrine', 'thyroid', 'diabetes', 'insulin', 'pancreas', 'adrenal'],
    entries: ['diabetes_mellitus', 'hypothyroidism', 'hyperthyroidism', 'cushings_syndrome', 'addisons_disease']
  },
  {
    id: 'musculoskeletal',
    name: 'Musculoskeletal Disorders',
    description: 'Conditions affecting muscles, bones, and joints',
    keywords: ['bone', 'muscle', 'joint', 'arthritis', 'osteoporosis', 'fracture', 'sprain'],
    entries: ['rheumatoid_arthritis', 'osteoarthritis', 'osteoporosis', 'fibromyalgia', 'gout', 'carpal_tunnel_syndrome']
  },
  {
    id: 'dermatological',
    name: 'Skin Disorders',
    description: 'Conditions affecting the skin',
    keywords: ['skin', 'rash', 'dermatitis', 'eczema', 'psoriasis', 'acne', 'dermatological'],
    entries: ['eczema', 'psoriasis', 'acne', 'rosacea', 'contact_dermatitis', 'urticaria', 'melanoma']
  },
  {
    id: 'mental_health',
    name: 'Mental Health Disorders',
    description: 'Conditions affecting mental health and behavior',
    keywords: ['mental', 'psychiatric', 'depression', 'anxiety', 'schizophrenia', 'bipolar', 'ptsd'],
    entries: ['major_depressive_disorder', 'generalized_anxiety_disorder', 'bipolar_disorder', 'schizophrenia', 'ptsd']
  }
];

/**
 * This function demonstrates how a query would be matched to the appropriate medical cluster
 * In a real implementation, this would use semantic embeddings for better matching
 */
export const findRelevantCluster = (query: string): MedicalCluster | null => {
  const normalizedQuery = query.toLowerCase();
  
  for (const cluster of medicalClusters) {
    for (const keyword of cluster.keywords) {
      if (normalizedQuery.includes(keyword)) {
        return cluster;
      }
    }
  }
  
  return null;
};

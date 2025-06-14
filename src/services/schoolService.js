import schoolsData from '../data/schools.json';

export class SchoolService {
  static getSchools() {
    return schoolsData.schools;
  }

  static getSchoolOptions(excludeRoyalCollege = false) {
    let schools = schoolsData.schools;
    
    if (excludeRoyalCollege) {
      schools = schools.filter(school => !this.isRoyalCollege(school.name));
    }
    
    return schools.map(school => ({
      value: school.name,
      label: school.name
    }));
  }

  static getCategoryForSchool(schoolName) {
    const school = schoolsData.schools.find(s => 
      s.name.toLowerCase() === schoolName.toLowerCase()
    );
    
    if (!school) {
      // Default to Inter School for unknown schools
      return 'Inter School';
    }
    
    return school.category;
  }

  static isRoyalCollege(schoolName) {
    return schoolName.toLowerCase().includes('royal college');
  }

  static validateSchoolCategory(schoolName, selectedCategory) {
    const expectedCategory = this.getCategoryForSchool(schoolName);
    
    // If it's Royal College and they selected Inter School, that's invalid
    if (this.isRoyalCollege(schoolName) && selectedCategory === 'Inter School') {
      return {
        valid: false,
        message: 'Students from Royal College cannot participate in the Inter School category. Please select Intra School category.'
      };
    }

    return {
      valid: true,
      message: null
    };
  }
}

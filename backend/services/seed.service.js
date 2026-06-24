const Station = require('../models/Station.model');
const Inbox = require('../models/Inbox.model');

const seedStations = async () => {
  try {
    const count = await Station.countDocuments();
    if (count > 0) {
      console.log('✅ Stations already seeded');
      return;
    }

    const stations = [
      {
        name: 'Pune Cantonment',
        state: 'Maharashtra',
        facilities: [
          {
            name: 'Command Hospital Pune',
            type: 'ECHS',
            distance: '2.3 km',
            timing: '8AM - 2PM',
            contact: '020-26334000'
          },
          {
            name: 'Kirkee CSD Canteen',
            type: 'CSD',
            distance: '1.1 km',
            timing: '9AM - 5PM',
            contact: '020-25813000'
          },
          {
            name: 'Army Public School Pune',
            type: 'School',
            distance: '3.2 km',
            timing: '8AM - 2PM',
            contact: '020-26334100'
          },
          {
            name: 'MES Office Pune',
            type: 'MES',
            distance: '1.5 km',
            timing: '9AM - 5PM',
            contact: '020-26334200'
          }
        ],
        accommodation: { waitlist: 23, available: 5 }
      },
      {
        name: 'Delhi Cantonment',
        state: 'Delhi',
        facilities: [
          {
            name: 'Base Hospital Delhi',
            type: 'ECHS',
            distance: '1.5 km',
            timing: '8AM - 4PM',
            contact: '011-25694000'
          },
          {
            name: 'Delhi CSD Canteen',
            type: 'CSD',
            distance: '0.8 km',
            timing: '9AM - 6PM',
            contact: '011-25694100'
          },
          {
            name: 'Army Public School Delhi',
            type: 'School',
            distance: '2.1 km',
            timing: '8AM - 2PM',
            contact: '011-25694200'
          },
          {
            name: 'MES Office Delhi',
            type: 'MES',
            distance: '1.2 km',
            timing: '9AM - 5PM',
            contact: '011-25694300'
          }
        ],
        accommodation: { waitlist: 45, available: 2 }
      },
      {
        name: 'Ambala Cantonment',
        state: 'Haryana',
        facilities: [
          {
            name: 'MH Ambala',
            type: 'ECHS',
            distance: '1.8 km',
            timing: '8AM - 2PM',
            contact: '0171-2633000'
          },
          {
            name: 'Ambala CSD Canteen',
            type: 'CSD',
            distance: '0.5 km',
            timing: '9AM - 5PM',
            contact: '0171-2633100'
          },
          {
            name: 'Army Public School Ambala',
            type: 'School',
            distance: '1.2 km',
            timing: '8AM - 2PM',
            contact: '0171-2633200'
          },
          {
            name: 'MES Office Ambala',
            type: 'MES',
            distance: '0.9 km',
            timing: '9AM - 5PM',
            contact: '0171-2633300'
          }
        ],
        accommodation: { waitlist: 12, available: 8 }
      },
      {
        name: 'Jaipur Cantonment',
        state: 'Rajasthan',
        facilities: [
          {
            name: 'MH Jaipur',
            type: 'ECHS',
            distance: '2.0 km',
            timing: '8AM - 2PM',
            contact: '0141-2383000'
          },
          {
            name: 'Jaipur CSD Canteen',
            type: 'CSD',
            distance: '1.3 km',
            timing: '9AM - 5PM',
            contact: '0141-2383100'
          },
          {
            name: 'Army Public School Jaipur',
            type: 'School',
            distance: '2.5 km',
            timing: '8AM - 2PM',
            contact: '0141-2383200'
          },
          {
            name: 'MES Office Jaipur',
            type: 'MES',
            distance: '1.8 km',
            timing: '9AM - 5PM',
            contact: '0141-2383300'
          }
        ],
        accommodation: { waitlist: 18, available: 3 }
      },
      {
        name: 'Hisar Cantonment',
        state: 'Haryana',
        facilities: [
          {
            name: 'MH Hisar',
            type: 'ECHS',
            distance: '1.2 km',
            timing: '8AM - 2PM',
            contact: '01662-234000'
          },
          {
            name: 'Hisar CSD Canteen',
            type: 'CSD',
            distance: '0.7 km',
            timing: '9AM - 5PM',
            contact: '01662-234100'
          },
          {
            name: 'Army Public School Hisar',
            type: 'School',
            distance: '1.5 km',
            timing: '8AM - 2PM',
            contact: '01662-234200'
          },
          {
            name: 'MES Office Hisar',
            type: 'MES',
            distance: '0.8 km',
            timing: '9AM - 5PM',
            contact: '01662-234300'
          }
        ],
        accommodation: { waitlist: 8, available: 6 }
      }
    ];

    await Station.insertMany(stations);
    console.log('✅ Stations seeded successfully');

  } catch (error) {
    console.log('❌ Station seed error:', error.message);
  }
};

const seedInbox = async () => {
  try {
    const count = await Inbox.countDocuments();
    if (count > 0) {
      console.log('✅ Inbox already seeded');
      return;
    }

    const news = [
      {
        source: 'ECHS',
        title: 'New ECHS Polyclinics opened in 5 new cities',
        content: 'ECHS has expanded its network by opening polyclinics in Patna, Bhopal, Lucknow, Nagpur and Coimbatore for better healthcare access to veterans.',
        originalUrl: 'https://echs.gov.in/news/1',
        category: 'Medical',
        isVerified: true,
        publishedAt: new Date()
      },
      {
        source: 'CSD',
        title: 'Diwali Special Offers at CSD Canteens across India',
        content: 'CSD canteens are offering special discounts on electronics, appliances and groceries this festive season. Valid till 31st October.',
        originalUrl: 'https://csd.gov.in/news/1',
        category: 'Canteen',
        isVerified: true,
        publishedAt: new Date(Date.now() - 86400000)
      },
      {
        source: 'AGIF',
        title: 'AGIF Premium Update for Group Insurance Scheme 2024',
        content: 'Army Group Insurance Fund has announced revised premium structures for the year 2024. All serving personnel are requested to update their nominations.',
        originalUrl: 'https://agif.in/news/1',
        category: 'Insurance',
        isVerified: true,
        publishedAt: new Date(Date.now() - 172800000)
      },
      {
        source: 'KSB',
        title: 'Kendriya Sainik Board Scholarship Applications Open',
        content: 'KSB has opened applications for scholarships for children of war widows and disabled soldiers. Last date to apply is 30th November 2024.',
        originalUrl: 'https://ksb.gov.in/news/1',
        category: 'Welfare',
        isVerified: true,
        publishedAt: new Date(Date.now() - 259200000)
      },
      {
        source: 'MOD',
        title: 'One Rank One Pension revised rates effective from July 2024',
        content: 'Ministry of Defence has announced revised OROP rates effective from July 2024. Veterans can check their updated pension amounts on the Sparsh portal.',
        originalUrl: 'https://mod.gov.in/news/1',
        category: 'Welfare',
        isVerified: true,
        publishedAt: new Date(Date.now() - 345600000)
      },
      {
        source: 'PIB',
        title: 'Army Welfare Housing Organisation launches new projects',
        content: 'AWHO has launched new housing projects in Pune, Bengaluru and Hyderabad for serving and retired Army personnel at subsidized rates.',
        originalUrl: 'https://pib.gov.in/news/1',
        category: 'Welfare',
        isVerified: true,
        publishedAt: new Date(Date.now() - 432000000)
      }
    ];

    await Inbox.insertMany(news);
    console.log('✅ Inbox seeded successfully');

  } catch (error) {
    console.log('❌ Inbox seed error:', error.message);
  }
};

module.exports = { seedStations, seedInbox };
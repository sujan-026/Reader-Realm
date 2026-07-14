
import { Book } from '../context/BookContext';

export const books: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop',
    blurImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=50&auto=format&fit=crop',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices.',
    rating: 4.2,
    reviews: [
      {
        id: 'r1',
        userId: 'u1',
        userName: 'Alex Johnson',
        userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 5,
        text: 'This book changed my perspective on life. The concept is fascinating and execution is flawless.',
        date: '2023-03-15T18:25:43.511Z'
      },
      {
        id: 'r2',
        userId: 'u2',
        userName: 'Michael Chen',
        userAvatar: 'https://randomuser.me/api/portraits/men/46.jpg',
        rating: 4,
        text: 'Beautifully written with a profound message about regret and possibility.',
        date: '2023-02-28T09:15:22.511Z'
      }
    ],
    genres: ['Fiction', 'Fantasy', 'Contemporary'],
    publicationDate: '2020-08-13',
    featured: true
  },
  {
    id: '2',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=687&auto=format&fit=crop',
    blurImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=50&auto=format&fit=crop',
    description: 'From the bestselling author of Never Let Me Go and The Remains of the Day, a stunning new novel that asks, what does it mean to love?',
    rating: 4.1,
    reviews: [
      {
        id: 'r3',
        userId: 'u3',
        userName: 'Sarah Williams',
        userAvatar: 'https://randomuser.me/api/portraits/women/64.jpg',
        rating: 4,
        text: 'Ishiguro has a way of making you question what it means to be human.',
        date: '2023-01-10T14:25:43.511Z'
      }
    ],
    genres: ['Science Fiction', 'Literary Fiction'],
    publicationDate: '2021-03-02'
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverImage: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=870&auto=format&fit=crop',
    blurImage: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=50&auto=format&fit=crop',
    description: 'A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian.',
    rating: 4.6,
    reviews: [
      {
        id: 'r4',
        userId: 'u4',
        userName: 'David Kim',
        userAvatar: 'https://randomuser.me/api/portraits/men/51.jpg',
        rating: 5,
        text: 'Even better than The Martian! The science is fascinating and the story is gripping from start to finish.',
        date: '2023-05-22T18:25:43.511Z'
      },
      {
        id: 'r5',
        userId: 'u5',
        userName: 'Emily Rodriguez',
        userAvatar: 'https://randomuser.me/api/portraits/women/12.jpg',
        rating: 4,
        text: 'Weir has a gift for making complex science accessible and entertaining.',
        date: '2023-04-17T18:25:43.511Z'
      }
    ],
    genres: ['Science Fiction', 'Adventure', 'Space'],
    publicationDate: '2021-05-04',
    featured: true
  },
  {
    id: '4',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    coverImage: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=690&auto=format&fit=crop',
    blurImage: 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=50&auto=format&fit=crop',
    description: 'A tale of gods, kings, immortal fame, and the human heart, The Song of Achilles is a dazzling literary feat that brilliantly reimagines Homer\'s enduring masterwork, The Iliad.',
    rating: 4.7,
    reviews: [
      {
        id: 'r6',
        userId: 'u6',
        userName: 'James Wilson',
        userAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        rating: 5,
        text: 'Beautifully written and heartbreaking. Miller brings the ancient world to vivid life.',
        date: '2022-12-03T18:25:43.511Z'
      }
    ],
    genres: ['Historical Fiction', 'Mythology', 'LGBT'],
    publicationDate: '2012-03-06'
  },
  {
    id: '5',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=773&auto=format&fit=crop',
    blurImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=50&auto=format&fit=crop',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    rating: 4.8,
    reviews: [
      {
        id: 'r7',
        userId: 'u7',
        userName: 'Rebecca Taylor',
        userAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        rating: 5,
        text: 'This book changed my approach to productivity and personal development. Highly recommend!',
        date: '2023-06-15T18:25:43.511Z'
      },
      {
        id: 'r8',
        userId: 'u8',
        userName: 'Robert Martinez',
        userAvatar: 'https://randomuser.me/api/portraits/men/36.jpg',
        rating: 4,
        text: 'Clear, practical advice that you can implement immediately. A great resource.',
        date: '2023-05-30T18:25:43.511Z'
      }
    ],
    genres: ['Self-Help', 'Psychology', 'Personal Development'],
    publicationDate: '2018-10-16',
    featured: true
  },
  {
    id: '6',
    title: 'Circe',
    author: 'Madeline Miller',
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=688&auto=format&fit=crop',
    blurImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=50&auto=format&fit=crop',
    description: 'In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born. But Circe is a strange child--not powerful, like her father, nor viciously alluring like her mother. Turning to the world of mortals for companionship, she discovers that she does possess power--the power of witchcraft.',
    rating: 4.5,
    reviews: [
      {
        id: 'r9',
        userId: 'u9',
        userName: 'Olivia Turner',
        userAvatar: 'https://randomuser.me/api/portraits/women/90.jpg',
        rating: 5,
        text: 'Miller\'s prose is enchanting. She breathes new life into an ancient character.',
        date: '2023-04-05T18:25:43.511Z'
      }
    ],
    genres: ['Fantasy', 'Mythology', 'Historical Fiction'],
    publicationDate: '2018-04-10'
  },
  {
    id: '7',
    title: 'The Lincoln Highway',
    author: 'Amor Towles',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=876&auto=format&fit=crop',
    blurImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=50&auto=format&fit=crop',
    description: 'In June, 1954, eighteen-year-old Emmett Watson is driven home to Nebraska by the warden of the juvenile work farm where he has just served fifteen months for involuntary manslaughter.',
    rating: 4.3,
    reviews: [
      {
        id: 'r10',
        userId: 'u10',
        userName: 'Thomas Jackson',
        userAvatar: 'https://randomuser.me/api/portraits/men/67.jpg',
        rating: 4,
        text: 'Towles creates such vivid characters and a compelling journey.',
        date: '2023-02-18T18:25:43.511Z'
      }
    ],
    genres: ['Historical Fiction', 'Adventure', 'Literary Fiction'],
    publicationDate: '2021-10-05'
  },
  {
    id: '8',
    title: 'Educated',
    author: 'Tara Westover',
    coverImage: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=1171&auto=format&fit=crop',
    blurImage: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=50&auto=format&fit=crop',
    description: 'An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
    rating: 4.7,
    reviews: [
      {
        id: 'r11',
        userId: 'u11',
        userName: 'Sophia Lee',
        userAvatar: 'https://randomuser.me/api/portraits/women/40.jpg',
        rating: 5,
        text: 'One of the most powerful memoirs I\'ve ever read. Westover\'s journey is extraordinary.',
        date: '2023-01-25T18:25:43.511Z'
      },
      {
        id: 'r12',
        userId: 'u12',
        userName: 'Daniel Moore',
        userAvatar: 'https://randomuser.me/api/portraits/men/42.jpg',
        rating: 4,
        text: 'Inspiring and thought-provoking. A testament to the power of education.',
        date: '2022-12-15T18:25:43.511Z'
      }
    ],
    genres: ['Memoir', 'Biography', 'Nonfiction'],
    publicationDate: '2018-02-20'
  }
];

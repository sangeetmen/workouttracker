const sampleExercises = [
    {
      "id": 1,
      "name": "Lying Chest Press Machine (Flat)",
      "category": "Upper Body",
      "muscleGroups": [
        "Chest",
        "Triceps",
        "Shoulders"
      ],
      "type": "strength",
      "image": "https://5.imimg.com/data5/SELLER/Default/2021/2/TG/UV/IY/19484956/lying-chest-press-1000x1000.jpg"
    },
    {
      "id": 2,
      "name": "Body Weighted Squats",
      "category": "Lower Body",
      "muscleGroups": [
        "Quadriceps",
        "Glutes",
        "Core"
      ],
      "type": "strength",
      "image": "https://hips.hearstapps.com/hmg-prod/images/whl-evergreen-2137-r-682ce60a0fc96.jpg?crop=1.00xw:1.00xh;0,0&resize=1400:*"
    },
    {
      "id": 3,
      "name": "Treadmill",
      "category": "Cardio",
      "muscleGroups": [
        "Legs",
        "Cardiovascular"
      ],
      "type": "cardio",
      "image": "https://hips.hearstapps.com/hmg-prod/images/lifestyle-gym-and-fitness-barcelona-athlete-running-royalty-free-image-1577740444.jpg?crop=0.668xw:1.00xh;0,0&resize=1400:*"
    },
    {
      "id": 4,
      "name": "Freestyle Swimming",
      "category": "Swimming",
      "muscleGroups": [
        "Full Body",
        "Cardiovascular"
      ],
      "type": "swimming",
      "image": "https://blog.arenaswim.com/wp-content/uploads/2021/02/arena_crawl_blog_nologo.gif"
    },
    {
      "id": 5,
      "name": "Plank",
      "category": "Core",
      "muscleGroups": [
        "Core",
        "Shoulders"
      ],
      "type": "strength",
      "image": "https://www.endomondo.com/wp-content/uploads/2024/07/Plank.png"
    },
    {
      "id": 6,
      "name": "Dynamic Stretching",
      "category": "Mobility",
      "muscleGroups": [
        "Full Body"
      ],
      "type": "mobility",
      "image": ""
    },
    {
      "id": 7,
      "name": "Deadlift",
      "category": "Lower Body",
      "muscleGroups": [
        "Hamstrings",
        "Glutes",
        "Back"
      ],
      "type": "strength",
      "image": ""
    },
    {
      "id": 8,
      "name": "Assisted Pull-up Machine",
      "category": "Upper Body",
      "muscleGroups": [
        "Back",
        "Biceps"
      ],
      "type": "strength",
      "image": "https://images.aasaan.shop/stores/b3412024/products/product_images/1/resized_1750163025859-1024w.webp?width=1024"
    },
    {
      "id": 9,
      "name": "Cycling",
      "category": "Cardio",
      "muscleGroups": [
        "Legs",
        "Cardiovascular"
      ],
      "type": "cardio",
      "image": "https://m.media-amazon.com/images/I/41T369MumKL.jpg"
    },
    {
      "id": 10,
      "name": "Dog Paddle Swimming",
      "category": "Swimming",
      "muscleGroups": [
        "Full Body",
        "Cardiovascular"
      ],
      "type": "swimming",
      "image": "https://www.howcast.com/.image/ar_4:3%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTU5NzA0NDU5NjExODc0MzI0/z-how-to-dog-paddle-promo-image.jpg"
    },
    {
      "id": 11,
      "name": "Machine Fly (Front)",
      "category": "Upper Body",
      "muscleGroups": [
        "Chest",
        "Shoulders"
      ],
      "type": "strength",
      "image": "https://training.fit/wp-content/uploads/2020/02/butterflys.png"
    },
    {
      "id": 12,
      "name": "Lat Pull Down (Front)",
      "category": "Upper Body",
      "muscleGroups": [
        "Lats",
        "Back",
		"Triceps"
      ],
      "type": "strength",
      "image": "https://apilyfta.com/static/GymvisualPNG/22911101-Cable-Wide-Grip-Lat-Pulldown-(female)_Back_small.png"
    }, 
	{
      "id": 13,
      "name": "Preacher Curl Machine",
      "category": "Upper Body",
      "muscleGroups": [
        "Biceps"
      ],
      "type": "strength",
      "image": "https://www.bullrockfitness.com/wp-content/uploads/2024/10/9.png"
    }, 
	{
      "id": 14,
      "name": "Triceps Dip Machine",
      "category": "Upper Body",
      "muscleGroups": [
        "Triceps"
      ],
      "type": "strength",
      "image": "https://cdn3.vectorstock.com/i/1000x1000/22/52/man-doing-assisted-machine-seated-tricep-dips-vector-40872252.jpg"
    }, 
	{
      "id": 15,
      "name": "Dumbbell Front Raises",
      "category": "Upper Body",
      "muscleGroups": [
        "Shoulders",
		"Chest",
		"Biceps"
      ],
      "type": "strength",
      "image": "https://images.squarespace-cdn.com/content/v1/5ffcea9416aee143500ea103/1637855489484-7MEHM17JI0FHU0ISILUZ/Standing%2BDumbbell%2BFront%2BRaises.png"
    }, 
	{
      "id": 16,
      "name": "Dumbbell Side (Lat) Raises",
      "category": "Upper Body",
      "muscleGroups": [
        "Lats",
		"Shoulder"		
      ],
      "type": "strength",
      "image": "https://cdn.shopify.com/s/files/1/0269/5551/3900/files/Dumbbell-Lateral-Raise_31c81eee-81c4-4ffe-890d-ee13dd5bbf20_600x600.png?v=1612138523"
    }, 
	{
      "id": 17,
      "name": "Dumbbell Bicep Curls",
      "category": "Upper Body",
      "muscleGroups": [
        "Biceps"		
      ],
      "type": "strength",
      "image": "https://training.fit/wp-content/uploads/2018/12/bizepscurls.png"
    }, 
	{
      "id": 18,
      "name": "Dumbbell Hammer Curls",
      "category": "Upper Body",
      "muscleGroups": [
        "Biceps"		
      ],
      "type": "strength",
      "image": "https://anabolicaliens.com/cdn/shop/articles/5fa2d13e06ae0ac61604ad32_hammer-curl.png?v=1641753307"
    },
    {
      "id": 19,
      "name": "Leg Press Machine",
      "category": "Lower Body",
      "muscleGroups": [
        "Quadriceps",
        "Glutes",
        "Hamstrings"
      ],
      "type": "strength",
      "image": "https://www.fitness-world.in/wp-content/uploads/2019/04/GLPH1100-LEG-PRESS_HACK-SQUAT-MACHINE.jpg"
    },
    {
      "id": 20,
      "name": "Lunges",
      "category": "Lower Body",
      "muscleGroups": [
        "Quadriceps",
        "Glutes",
        "Hamstrings"
      ],
      "type": "strength",
      "image": "https://trainingstation.co.uk/cdn/shop/articles/Lunges-movment_d958998d-2a9f-430e-bdea-06f1e2bcc835_600x.webp?v=1741687877"
    },
    {
      "id": 21,
      "name": "Leg Curl Machine",
      "category": "Lower Body",
      "muscleGroups": [
        "Calves",
        "Glutes",
        "Hamstrings"
      ],
      "type": "strength",
      "image": "https://static.strengthlevel.com/images/exercises/standing-leg-curl/standing-leg-curl-800.jpg"
    },
    {
      "id": 22,
      "name": "Leg Extension Machine",
      "category": "Lower Body",
      "muscleGroups": [
        "Quadriceps",
        "Glutes",
        "Hamstrings"
      ],
      "type": "strength",
      "image": "https://fitnessprogramer.com/wp-content/uploads/2021/02/LEG-EXTENSION.gif"
    },
    {
      "id": 23,
      "name": "Standing Calf Raises",
      "category": "Lower Body",
      "muscleGroups": [
        "Calves",
        "Gastrocnemius",
        "Soleus"
      ],
      "type": "strength",
      "image": "https://training.fit/wp-content/uploads/2020/03/wadenheben-stehend-geraet.png"
    },
    {
      "id": 24,
      "name": "Sitting Calf Raises",
      "category": "Lower Body",
      "muscleGroups": [
        "Calves",
        "Soleus"
      ],
      "type": "strength",
      "image": "https://static.strengthlevel.com/images/exercises/seated-calf-raise/seated-calf-raise-800.jpg"
    },
    {
      "id": 25,
      "name": "Crosfit (Eliptical)",
      "category": "Cardio",
      "muscleGroups": [
        "Legs",
        "Cardiovascular"
      ],
      "type": "cardio",
      "image": "https://imfitindia.com/cdn/shop/articles/2cd0fa2e74978bba93323d35457e6737_1024x1024.png?v=1634367223"
    },
    {
      "id": 26,
      "name": "Leg Raises",
      "category": "Cardio",
      "muscleGroups": [
        "Quadriceps",
        "Abs",
		"Lower Back"
      ],
      "type": "cardio",
      "image": "https://www.endomondo.com/wp-content/uploads/2024/07/Leg-Raises.png"
    }
	
  ]

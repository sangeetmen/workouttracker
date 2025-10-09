$(document).ready(function() {
    console.log('FitTrack app initializing...');
    
    // Application state - using in-memory storage
    let currentSection = 'search-section';
    let exercises = [];
    let workouts = [];
    let personalRecords = {};

    // Sample data initialization
    const sampleExercises = [
        {
            id: 1,
            name: "Bench Press",
            category: "Upper Body",
            muscleGroups: ["Chest", "Triceps", "Shoulders"],
            type: "strength"
        },
        {
            id: 2,
            name: "Squats",
            category: "Lower Body", 
            muscleGroups: ["Quadriceps", "Glutes", "Core"],
            type: "strength"
        },
        {
            id: 3,
            name: "Treadmill",
            category: "Cardio",
            muscleGroups: ["Legs", "Cardiovascular"],
            type: "cardio"
        },
        {
            id: 4,
            name: "Freestyle Swimming",
            category: "Swimming",
            muscleGroups: ["Full Body", "Cardiovascular"],
            type: "swimming"
        },
        {
            id: 5,
            name: "Plank",
            category: "Core",
            muscleGroups: ["Core", "Shoulders"],
            type: "strength"
        },
        {
            id: 6,
            name: "Dynamic Stretching",
            category: "Mobility",
            muscleGroups: ["Full Body"],
            type: "mobility"
        },
        {
            id: 7,
            name: "Deadlift",
            category: "Lower Body",
            muscleGroups: ["Hamstrings", "Glutes", "Back"],
            type: "strength"
        },
        {
            id: 8,
            name: "Pull-ups",
            category: "Upper Body",
            muscleGroups: ["Back", "Biceps"],
            type: "strength"
        },
        {
            id: 9,
            name: "Cycling",
            category: "Cardio",
            muscleGroups: ["Legs", "Cardiovascular"],
            type: "cardio"
        },
        {
            id: 10,
            name: "Backstroke Swimming",
            category: "Swimming",
            muscleGroups: ["Full Body", "Cardiovascular"],
            type: "swimming"
        }
    ];

    // Sample workout data with individual sets
    const sampleWorkouts = [
        {
            id: 1,
            date: "2024-10-08",
            exerciseId: 1,
            exerciseName: "Bench Press",
            category: "Upper Body",
            type: "strength",
            sets: [
                {setNumber: 1, reps: 12, weight: 60},
                {setNumber: 2, reps: 10, weight: 70},
                {setNumber: 3, reps: 8, weight: 80}
            ]
        },
        {
            id: 2,
            date: "2024-10-07",
            exerciseId: 3,
            exerciseName: "Treadmill",
            category: "Cardio",
            type: "cardio",
            duration: 30,
            distance: 5.2,
            pace: 5.77,
            incline: 2
        }
    ];

    // Initialize application
    function initApp() {
        console.log('Initializing app...');
        loadData();
        initNavigation();
        initEventListeners();
        setTodaysDate();
        updateStreakCounter();
        loadAllExercises();
        calculatePersonalRecords();
        showToast('Welcome to FitTrack!');
        console.log('App initialization complete');
        console.log('Loaded exercises:', exercises.length);
    }

    // Data management
    function loadData() {
        console.log('Loading data...');
        exercises = [...sampleExercises];
        workouts = [...sampleWorkouts];
        console.log('Data loaded:', { exercises: exercises.length, workouts: workouts.length });
    }

    // Calculate personal records from workout history
    function calculatePersonalRecords() {
        personalRecords = {};
        
        workouts.forEach(workout => {
            const exerciseId = workout.exerciseId;
            if (!personalRecords[exerciseId]) {
                personalRecords[exerciseId] = {};
            }

            const pr = personalRecords[exerciseId];

            if (workout.type === 'strength' && workout.sets) {
                workout.sets.forEach(set => {
                    // Max weight
                    if (!pr.maxWeight || set.weight > pr.maxWeight.weight) {
                        pr.maxWeight = { weight: set.weight, reps: set.reps, date: workout.date };
                    }
                    // Max reps
                    if (!pr.maxReps || set.reps > pr.maxReps.reps) {
                        pr.maxReps = { reps: set.reps, weight: set.weight, date: workout.date };
                    }
                });
            } else if (workout.type === 'cardio') {
                // Best time (fastest pace)
                if (workout.pace && (!pr.bestPace || workout.pace > pr.bestPace.pace)) {
                    pr.bestPace = { pace: workout.pace, distance: workout.distance, date: workout.date };
                }
                // Longest distance
                if (workout.distance && (!pr.longestDistance || workout.distance > pr.longestDistance.distance)) {
                    pr.longestDistance = { distance: workout.distance, duration: workout.duration, date: workout.date };
                }
            } else if (workout.type === 'swimming') {
                // Most laps
                if (workout.laps && (!pr.mostLaps || workout.laps > pr.mostLaps.laps)) {
                    pr.mostLaps = { laps: workout.laps, time: workout.totalTime, date: workout.date };
                }
                // Best time
                if (workout.totalTime && (!pr.bestTime || workout.totalTime < pr.bestTime.time)) {
                    pr.bestTime = { time: workout.totalTime, laps: workout.laps, date: workout.date };
                }
            } else if (workout.type === 'mobility') {
                // Longest duration
                if (workout.duration && (!pr.longestDuration || workout.duration > pr.longestDuration.duration)) {
                    pr.longestDuration = { duration: workout.duration, intensity: workout.intensity, date: workout.date };
                }
            }
        });
    }

    // Navigation
    function initNavigation() {
        console.log('Initializing navigation...');
        $('.nav-item').off('click').on('click', function(e) {
            e.preventDefault();
            const targetSection = $(this).data('section');
            console.log('Navigation clicked:', targetSection);
            
            if (targetSection && targetSection !== currentSection) {
                switchSection(targetSection);
            }
        });
    }

    function switchSection(sectionId) {
        console.log('Switching from', currentSection, 'to', sectionId);
        
        $('.nav-item').removeClass('active');
        $(`.nav-item[data-section="${sectionId}"]`).addClass('active');
        $('.content-section').removeClass('active');
        $(`#${sectionId}`).addClass('active');
        
        currentSection = sectionId;

        if (sectionId === 'search-section') {
            loadAllExercises();
        } else if (sectionId === 'entry-section') {
            updateCurrentWorkoutDisplay();
        } else if (sectionId === 'master-section') {
            loadExercisesList();
        }
        
        showToast(`Switched to ${sectionId.replace('-section', '').replace('-', ' ')} section`);
    }

    // Event listeners
    function initEventListeners() {
        console.log('Initializing event listeners...');
        
        // Exercise category change with validation
        $('#exercise-category').on('change', function() {
            const category = $(this).val();
            console.log('Category changed to:', category);
            validateField(this, 'category-error', 'Please select a category');
            updateExerciseDropdown(category);
            updateDynamicFormFields();
        });

        // Exercise selection change with validation
        $('#exercise-select').on('change', function() {
            const exerciseId = $(this).val();
            console.log('Exercise selected:', exerciseId);
            validateField(this, 'exercise-error', 'Please select an exercise');
            updateDynamicFormFields();
        });

        // Date validation
        $('#workout-date').on('change', function() {
            validateField(this, 'date-error', 'Please select a date');
        });

        // Workout form submission with validation
        $('#workout-form').on('submit', function(e) {
            e.preventDefault();
            if (validateWorkoutForm()) {
                saveWorkout();
            }
        });

        // Add exercise form submission with validation
        $('#add-exercise-form').on('submit', function(e) {
            e.preventDefault();
            if (validateAddExerciseForm()) {
                addNewExercise();
            }
        });

        // Search functionality
        $('#search-btn').on('click', performSearch);
        $('#search-input').on('keypress', function(e) {
            if (e.which === 13) {
                performSearch();
            }
        });

        // Modal close
        $(document).on('click', '.modal-close', function() {
            $(this).closest('.modal').addClass('hidden');
        });

        // Exercise card clicks
        $(document).on('click', '.exercise-card', function() {
            const exerciseId = $(this).data('exercise-id');
            showExerciseDetail(exerciseId);
        });

        // Add set functionality
        $(document).on('click', '.add-set-btn', function() {
            addSet();
        });

        // Remove set functionality
        $(document).on('click', '.remove-set-btn', function() {
            $(this).closest('.set-row').remove();
            updateSetNumbers();
        });

        // Category filter in master section
        $('#filter-category').on('change', function() {
            loadExercisesList();
        });

        // Auto-focus on next input
        $(document).on('input', '.set-input', function() {
            const $currentRow = $(this).closest('.set-row');
            const $nextInput = $currentRow.find('.set-input').eq($(this).parent().index());
            if ($(this).val() && $nextInput.length && $nextInput.get(0) !== this) {
                $nextInput.focus();
            }
        });
    }

    // Form Validation
    function validateField(field, errorId, message) {
        const $field = $(field);
        const $error = $(`#${errorId}`);
        const value = $field.val().trim();

        if (!value) {
            $field.removeClass('success').addClass('error');
            $error.text(message).show();
            return false;
        } else {
            $field.removeClass('error').addClass('success');
            $error.hide();
            return true;
        }
    }

    function validateNumericField(field, errorId, message, min = null, max = null) {
        const $field = $(field);
        const $error = $(`#${errorId}`);
        const value = parseFloat($field.val());

        if (isNaN(value) || (min !== null && value < min) || (max !== null && value > max)) {
            $field.removeClass('success').addClass('error');
            $error.text(message).show();
            return false;
        } else {
            $field.removeClass('error').addClass('success');
            $error.hide();
            return true;
        }
    }

    function validateWorkoutForm() {
        let isValid = true;

        // Validate required fields
        isValid &= validateField('#workout-date', 'date-error', 'Please select a date');
        isValid &= validateField('#exercise-category', 'category-error', 'Please select a category');
        
        const category = $('#exercise-category').val();
        if (category !== 'Rest Day') {
            isValid &= validateField('#exercise-select', 'exercise-error', 'Please select an exercise');
        }

        // Validate dynamic fields based on exercise type
        const exercise = exercises.find(ex => ex.id == $('#exercise-select').val());
        if (exercise && exercise.type === 'strength') {
            // Validate sets
            $('.set-input').each(function() {
                const $input = $(this);
                const type = $input.hasClass('reps-input') ? 'reps' : 'weight';
                const min = type === 'reps' ? 1 : 0;
                const message = type === 'reps' ? 'Reps must be at least 1' : 'Weight must be 0 or greater';
                
                if (!validateNumericField(this, null, message, min)) {
                    isValid = false;
                }
            });
        }

        return isValid;
    }

    function validateAddExerciseForm() {
        let isValid = true;
        isValid &= validateField('#new-exercise-name', 'new-name-error', 'Please enter an exercise name');
        isValid &= validateField('#new-exercise-category', 'new-category-error', 'Please select a category');
        
        // Check for duplicate exercise names
        const name = $('#new-exercise-name').val().trim();
        if (exercises.some(ex => ex.name.toLowerCase() === name.toLowerCase())) {
            $('#new-exercise-name').removeClass('success').addClass('error');
            $('#new-name-error').text('Exercise already exists').show();
            isValid = false;
        }

        return isValid;
    }

    // Set today's date
    function setTodaysDate() {
        const today = new Date().toISOString().split('T')[0];
        $('#workout-date').val(today);
    }

    // Update exercise dropdown based on category - FIXED
    function updateExerciseDropdown(category) {
        const $exerciseSelect = $('#exercise-select');
        $exerciseSelect.empty().append('<option value="">Select Exercise</option>');
        
        console.log('Updating exercise dropdown for category:', category);
        console.log('Available exercises:', exercises.length);

        if (category === 'Rest Day') {
            $exerciseSelect.append('<option value="rest_day">Rest Day</option>');
            $('#exercise-selection-group').hide();
            return;
        } else {
            $('#exercise-selection-group').show();
        }

        const filteredExercises = exercises.filter(ex => ex.category === category);
        console.log('Filtered exercises for category', category, ':', filteredExercises.length);
        
        filteredExercises.forEach(exercise => {
            $exerciseSelect.append(`<option value="${exercise.id}">${exercise.name}</option>`);
            console.log('Added exercise to dropdown:', exercise.name);
        });
        
        console.log('Exercise dropdown updated with', filteredExercises.length, 'exercises');
    }

    // Update dynamic form fields with set management
    function updateDynamicFormFields() {
        const category = $('#exercise-category').val();
        const exerciseId = $('#exercise-select').val();
        const $dynamicFields = $('#dynamic-form-fields');
        
        $dynamicFields.empty();

        if (!category || (!exerciseId && category !== 'Rest Day')) return;

        if (category === 'Rest Day') {
            $dynamicFields.html(`
                <div class="dynamic-field-group">
                    <h5>Rest Day</h5>
                    <div class="form-group">
                        <label class="form-label">Notes (Optional)</label>
                        <textarea class="form-control" id="rest-notes" rows="3" placeholder="How did you feel today? Any recovery activities?"></textarea>
                    </div>
                </div>
            `);
            return;
        }

        const exercise = exercises.find(ex => ex.id == exerciseId);
        if (!exercise) return;

        let fieldsHtml = '';

        if (exercise.type === 'strength') {
            fieldsHtml += `
                <div class="sets-container">
                    <div class="sets-header">
                        <h5 class="sets-title">Sets for ${exercise.name}</h5>
                        <button type="button" class="add-set-btn">+ Add Set</button>
                    </div>
                    <div class="sets-list">
                        <!-- Sets will be added here -->
                    </div>
                </div>
            `;
        } else if (exercise.type === 'cardio') {
            fieldsHtml += `
                <div class="dynamic-field-group">
                    <h5>${exercise.name}</h5>
                    <div class="field-row">
                        <div class="form-group">
                            <label class="form-label">Duration (minutes) *</label>
                            <input type="number" class="form-control" id="duration" min="1" placeholder="30" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Distance (km)</label>
                            <input type="number" class="form-control" id="distance" step="0.1" placeholder="5.0" min="0">
                        </div>
                    </div>
                    <div class="field-row">
                        <div class="form-group">
                            <label class="form-label">Average Speed (km/h)</label>
                            <input type="number" class="form-control" id="speed" step="0.1" placeholder="10.0" min="0">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Incline (%)</label>
                            <input type="number" class="form-control" id="incline" step="0.5" placeholder="2.0" min="0">
                        </div>
                    </div>
                </div>
            `;
        } else if (exercise.type === 'swimming') {
            fieldsHtml += `
                <div class="dynamic-field-group">
                    <h5>${exercise.name}</h5>
                    <div class="field-row">
                        <div class="form-group">
                            <label class="form-label">Laps *</label>
                            <input type="number" class="form-control" id="laps" min="1" placeholder="20" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Pool Length</label>
                            <select class="form-control" id="pool-length">
                                <option value="25m">25m</option>
                                <option value="50m">50m</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="field-row">
                        <div class="form-group">
                            <label class="form-label">Total Time (minutes)</label>
                            <input type="number" class="form-control" id="total-time" step="0.5" placeholder="45" min="0">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Stroke Type</label>
                            <select class="form-control" id="stroke-type">
                                <option value="Freestyle">Freestyle</option>
                                <option value="Backstroke">Backstroke</option>
                                <option value="Breaststroke">Breaststroke</option>
                                <option value="Butterfly">Butterfly</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
        } else if (exercise.type === 'mobility') {
            fieldsHtml += `
                <div class="dynamic-field-group">
                    <h5>${exercise.name}</h5>
                    <div class="field-row">
                        <div class="form-group">
                            <label class="form-label">Duration (minutes) *</label>
                            <input type="number" class="form-control" id="duration" min="1" placeholder="15" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Intensity</label>
                            <select class="form-control" id="intensity">
                                <option value="Light">Light</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Intense">Intense</option>
                            </select>
                        </div>
                    </div>
                </div>
            `;
        }

        fieldsHtml += `
            <div class="form-group">
                <label class="form-label">Notes (Optional)</label>
                <textarea class="form-control" id="exercise-notes" rows="2" placeholder="How did it feel? Any observations?"></textarea>
            </div>
        `;
        
        $dynamicFields.html(fieldsHtml);

        // Add initial set for strength exercises
        if (exercise.type === 'strength') {
            addSet();
        }
    }

    // Set Management
    function addSet() {
        const setCount = $('.set-row').length;
        const setNumber = setCount + 1;
        
        const setHtml = `
            <div class="set-row">
                <div class="set-number">Set ${setNumber}:</div>
                <div class="form-group">
                    <input type="number" class="form-control set-input reps-input" placeholder="Reps" min="1" required>
                </div>
                <div class="form-group">
                    <input type="number" class="form-control set-input weight-input" placeholder="Weight (kg)" step="0.5" min="0" required>
                </div>
                <div>
                    <button type="button" class="remove-set-btn">Remove</button>
                </div>
            </div>
        `;
        
        $('.sets-list').append(setHtml);
        
        // Focus on the reps input of the new set
        $('.set-row').last().find('.reps-input').focus();
    }

    function updateSetNumbers() {
        $('.set-row').each(function(index) {
            $(this).find('.set-number').text(`Set ${index + 1}:`);
        });
    }

    // Save workout with individual sets
    function saveWorkout() {
        const workoutData = collectWorkoutData();
        if (!workoutData) return;

        workouts.push(workoutData);
        calculatePersonalRecords();

        console.log('Workout saved:', workoutData);
        showToast('Workout saved successfully!');
        updateCurrentWorkoutDisplay();
        clearForm();
        updateStreakCounter();
        loadAllExercises(); // Refresh to show updated last workout dates
    }

    // Collect workout data from form
    function collectWorkoutData() {
        const date = $('#workout-date').val();
        const category = $('#exercise-category').val();
        const exerciseId = $('#exercise-select').val();

        const data = {
            id: Date.now(),
            date: date,
            category: category,
            timestamp: new Date().toISOString()
        };

        if (category === 'Rest Day') {
            data.exerciseId = 'rest_day';
            data.exerciseName = 'Rest Day';
            data.notes = $('#rest-notes').val();
            data.type = 'rest';
            return data;
        }

        const exercise = exercises.find(ex => ex.id == exerciseId);
        data.exerciseId = parseInt(exerciseId);
        data.exerciseName = exercise.name;
        data.type = exercise.type;

        // Collect type-specific data
        if (exercise.type === 'strength') {
            data.sets = [];
            $('.set-row').each(function(index) {
                const reps = parseInt($(this).find('.reps-input').val());
                const weight = parseFloat($(this).find('.weight-input').val());
                if (reps && !isNaN(weight)) {
                    data.sets.push({
                        setNumber: index + 1,
                        reps: reps,
                        weight: weight
                    });
                }
            });
        } else if (exercise.type === 'cardio') {
            data.duration = parseInt($('#duration').val()) || 0;
            data.distance = parseFloat($('#distance').val()) || 0;
            data.speed = parseFloat($('#speed').val()) || 0;
            data.incline = parseFloat($('#incline').val()) || 0;
            if (data.duration && data.distance) {
                data.pace = data.distance / (data.duration / 60); // km/h
            }
        } else if (exercise.type === 'swimming') {
            data.laps = parseInt($('#laps').val()) || 0;
            data.poolLength = $('#pool-length').val();
            data.totalTime = parseFloat($('#total-time').val()) || 0;
            data.strokeType = $('#stroke-type').val();
        } else if (exercise.type === 'mobility') {
            data.duration = parseInt($('#duration').val()) || 0;
            data.intensity = $('#intensity').val();
        }

        data.notes = $('#exercise-notes').val();
        return data;
    }

    // Clear form
    function clearForm() {
        $('#workout-form')[0].reset();
        $('#dynamic-form-fields').empty();
        $('.form-control').removeClass('success error');
        $('.error-message').hide();
        setTodaysDate();
    }

    // Load all exercises for search section
    // function loadAllExercises() {
    //     let exercisesHtml = '';
        
    //     exercises.forEach(exercise => {
    //         const workoutsForExercise = workouts.filter(w => w.exerciseId == exercise.id);
    //         const lastWorkout = workoutsForExercise.length > 0 ? 
    //             workoutsForExercise[workoutsForExercise.length - 1] : null;
    //         const pr = personalRecords[exercise.id] || {};
            
    //         let prText = 'No records';
    //         if (exercise.type === 'strength' && pr.maxWeight) {
    //             prText = `PR: ${pr.maxWeight.weight}kg × ${pr.maxWeight.reps} reps`;
    //         } else if (exercise.type === 'cardio' && pr.bestPace) {
    //             prText = `PR: ${pr.bestPace.pace.toFixed(1)} km/h`;
    //         } else if (exercise.type === 'swimming' && pr.mostLaps) {
    //             prText = `PR: ${pr.mostLaps.laps} laps`;
    //         } else if (exercise.type === 'mobility' && pr.longestDuration) {
    //             prText = `PR: ${pr.longestDuration.duration} min`;
    //         }

    //         const lastWorkoutText = lastWorkout ? 
    //             new Date(lastWorkout.date).toLocaleDateString() : 'Never';

    //         exercisesHtml += `
    //             <div class="exercise-card" data-exercise-id="${exercise.id}">
    //                 <div class="exercise-card-header">
    //                     <div class="exercise-card-title">${exercise.name}</div>
    //                     <div class="exercise-card-category">${exercise.category}</div>
    //                 </div>
    //                 <div class="exercise-card-info">
    //                     <div class="exercise-info-item">
    //                         <span class="exercise-info-value">${workoutsForExercise.length}</span>
    //                         <span class="exercise-info-label">Sessions</span>
    //                     </div>
    //                     <div class="exercise-info-item">
    //                         <span class="exercise-info-value">${lastWorkoutText}</span>
    //                         <span class="exercise-info-label">Last</span>
    //                     </div>
    //                 </div>
    //                 <div class="exercise-pr-info">${prText}</div>
    //             </div>
    //         `;
    //     });

    //     $('#all-exercises-list').html(exercisesHtml);
    // }

    function loadAllExercises() {
      const html = exercises.map(renderExerciseCard).join('');
      $('#all-exercises-list').html(html);
      $('#default-exercises').removeClass('hidden');
      $('#search-results').addClass('hidden');
    }


    // Search functionality - FIXED to include last workout date
    // function performSearch() {
    //     const query = $('#search-input').val().toLowerCase().trim();
        
    //     if (!query) {
    //         $('#search-results').addClass('hidden');
    //         $('#default-exercises').removeClass('hidden');
    //         return;
    //     }

    //     const matchingExercises = exercises.filter(ex => 
    //         ex.name.toLowerCase().includes(query) || 
    //         ex.category.toLowerCase().includes(query) ||
    //         ex.muscleGroups.some(mg => mg.toLowerCase().includes(query))
    //     );

    //     let resultsHtml = '';
    //     matchingExercises.forEach(exercise => {
    //         const workoutsForExercise = workouts.filter(w => w.exerciseId == exercise.id);
    //         const lastWorkout = workoutsForExercise.length > 0 ? 
    //             workoutsForExercise[workoutsForExercise.length - 1] : null;
    //         const pr = personalRecords[exercise.id] || {};
            
    //         let prText = 'No records';
    //         if (exercise.type === 'strength' && pr.maxWeight) {
    //             prText = `PR: ${pr.maxWeight.weight}kg × ${pr.maxWeight.reps} reps`;
    //         } else if (exercise.type === 'cardio' && pr.bestPace) {
    //             prText = `PR: ${pr.bestPace.pace.toFixed(1)} km/h`;
    //         } else if (exercise.type === 'swimming' && pr.mostLaps) {
    //             prText = `PR: ${pr.mostLaps.laps} laps`;
    //         } else if (exercise.type === 'mobility' && pr.longestDuration) {
    //             prText = `PR: ${pr.longestDuration.duration} min`;
    //         }

    //         const lastWorkoutText = lastWorkout ? 
    //             new Date(lastWorkout.date).toLocaleDateString() : 'Never';

    //         resultsHtml += `
    //             <div class="exercise-card" data-exercise-id="${exercise.id}">
    //                 <div class="exercise-card-header">
    //                     <div class="exercise-card-title">${exercise.name}</div>
    //                     <div class="exercise-card-category">${exercise.category}</div>
    //                 </div>
    //                 <div class="exercise-card-info">
    //                     <div class="exercise-info-item">
    //                         <span class="exercise-info-value">${workoutsForExercise.length}</span>
    //                         <span class="exercise-info-label">Sessions</span>
    //                     </div>
    //                     <div class="exercise-info-item">
    //                         <span class="exercise-info-value">${lastWorkoutText}</span>
    //                         <span class="exercise-info-label">Last</span>
    //                     </div>
    //                 </div>
    //                 <div class="exercise-pr-info">${prText}</div>
    //             </div>
    //         `;
    //     });

    //     if (resultsHtml === '') {
    //         resultsHtml = '<p class="text-center">No exercises found for "' + query + '"</p>';
    //     }

    //     $('#search-results-list').html(resultsHtml);
    //     $('#search-results').removeClass('hidden');
    //     $('#default-exercises').addClass('hidden');
    // }
    function performSearch() {
      const query = ($('#search-input').val() || '').trim().toLowerCase();
      const results = exercises.filter(ex =>
        ex.name.toLowerCase().includes(query) ||
        ex.category.toLowerCase().includes(query) ||
        (ex.muscleGroups || []).some(m => m.toLowerCase().includes(query))
      );
    
      const html = results.map(renderExerciseCard).join('') || `<div class="empty-state">No exercises found for “${query}”.</div>`;
      $('#search-results-list').html(html);
      $('#search-results').removeClass('hidden');
      $('#default-exercises').addClass('hidden');
    }

    
    // Show exercise detail modal
    function showExerciseDetail(exerciseId) {
        const exercise = exercises.find(ex => ex.id == exerciseId);
        if (!exercise) return;

        const workoutsForExercise = workouts.filter(w => w.exerciseId == exerciseId);
        const lastWorkout = workoutsForExercise.length > 0 ? 
            workoutsForExercise[workoutsForExercise.length - 1] : null;
        const pr = personalRecords[exerciseId] || {};

        $('#modal-exercise-name').text(exercise.name);

        // Last workout info
        let lastWorkoutHtml = '';
        if (lastWorkout) {
            lastWorkoutHtml = `
                <div class="workout-info">
                    <div class="workout-date">Date: ${new Date(lastWorkout.date).toLocaleDateString()}</div>
            `;
            
            if (lastWorkout.type === 'strength' && lastWorkout.sets) {
                lastWorkoutHtml += '<div class="workout-sets">Sets:</div>';
                lastWorkout.sets.forEach(set => {
                    lastWorkoutHtml += `
                        <div class="set-info">Set ${set.setNumber}: ${set.reps} reps @ ${set.weight}kg</div>
                    `;
                });
            } else if (lastWorkout.type === 'cardio') {
                lastWorkoutHtml += `
                    <div>Duration: ${lastWorkout.duration} minutes</div>
                    <div>Distance: ${lastWorkout.distance || 'N/A'} km</div>
                    <div>Speed: ${lastWorkout.speed || 'N/A'} km/h</div>
                `;
            }
            
            if (lastWorkout.notes) {
                lastWorkoutHtml += `<div class="workout-notes"><strong>Notes:</strong> ${lastWorkout.notes}</div>`;
            }
            
            lastWorkoutHtml += '</div>';
        } else {
            lastWorkoutHtml = '<p>No previous workouts recorded</p>';
        }
        $('#last-workout-info').html(lastWorkoutHtml);

        // Personal records info
        let prHtml = '';
        if (exercise.type === 'strength') {
            if (pr.maxWeight) {
                prHtml += `
                    <div class="pr-item">
                        <div class="pr-label">Max Weight</div>
                        <div class="pr-value">${pr.maxWeight.weight}kg × ${pr.maxWeight.reps} reps</div>
                        <div class="pr-date">on ${new Date(pr.maxWeight.date).toLocaleDateString()}</div>
                    </div>
                `;
            }
            if (pr.maxReps) {
                prHtml += `
                    <div class="pr-item">
                        <div class="pr-label">Max Reps</div>
                        <div class="pr-value">${pr.maxReps.reps} reps @ ${pr.maxReps.weight}kg</div>
                        <div class="pr-date">on ${new Date(pr.maxReps.date).toLocaleDateString()}</div>
                    </div>
                `;
            }
        } else if (exercise.type === 'cardio') {
            if (pr.bestPace) {
                prHtml += `
                    <div class="pr-item">
                        <div class="pr-label">Best Pace</div>
                        <div class="pr-value">${pr.bestPace.pace.toFixed(1)} km/h</div>
                        <div class="pr-date">on ${new Date(pr.bestPace.date).toLocaleDateString()}</div>
                    </div>
                `;
            }
            if (pr.longestDistance) {
                prHtml += `
                    <div class="pr-item">
                        <div class="pr-label">Longest Distance</div>
                        <div class="pr-value">${pr.longestDistance.distance} km</div>
                        <div class="pr-date">on ${new Date(pr.longestDistance.date).toLocaleDateString()}</div>
                    </div>
                `;
            }
        } else if (exercise.type === 'swimming') {
            if (pr.mostLaps) {
                prHtml += `
                    <div class="pr-item">
                        <div class="pr-label">Most Laps</div>
                        <div class="pr-value">${pr.mostLaps.laps} laps</div>
                        <div class="pr-date">on ${new Date(pr.mostLaps.date).toLocaleDateString()}</div>
                    </div>
                `;
            }
        } else if (exercise.type === 'mobility') {
            if (pr.longestDuration) {
                prHtml += `
                    <div class="pr-item">
                        <div class="pr-label">Longest Duration</div>
                        <div class="pr-value">${pr.longestDuration.duration} minutes</div>
                        <div class="pr-date">on ${new Date(pr.longestDuration.date).toLocaleDateString()}</div>
                    </div>
                `;
            }
        }

        if (prHtml === '') {
            prHtml = '<p>No personal records yet</p>';
        }
        $('#personal-records-info').html(prHtml);

        $('#exercise-detail-modal').removeClass('hidden');
    }

    // Add new exercise
    function addNewExercise() {
        const name = $('#new-exercise-name').val().trim();
        const category = $('#new-exercise-category').val();
        
        const muscleGroups = [];
        $('#muscle-groups-checkboxes input:checked').each(function() {
            muscleGroups.push($(this).val());
        });

        const newExercise = {
            id: Date.now(),
            name: name,
            category: category,
            muscleGroups: muscleGroups,
            type: getExerciseType(category)
        };

        exercises.push(newExercise);
        
        // Clear form
        $('#add-exercise-form')[0].reset();
        $('#muscle-groups-checkboxes input').prop('checked', false);
        $('.form-control').removeClass('success error');
        $('.error-message').hide();
        
        showToast('Exercise added successfully!');
        loadExercisesList();
        loadAllExercises();
    }

    // Get exercise type based on category
    function getExerciseType(category) {
        const typeMap = {
            'Upper Body': 'strength',
            'Lower Body': 'strength',
            'Core': 'strength',
            'Cardio': 'cardio',
            'Swimming': 'swimming',
            'Mobility': 'mobility'
        };
        return typeMap[category] || 'strength';
    }

    function getExerciseImage(exercise) {
  // Accepts either an uploaded data URL or a normal URL
  return exercise.imageUrl && exercise.imageUrl.trim() ? exercise.imageUrl.trim() : '';
}

function renderExerciseCard(exercise) {
  const img = getExerciseImage(exercise);
  const muscleList = (exercise.muscleGroups || []).join(', ');
  return `
    <div class="exercise-card" data-exercise-id="${exercise.id}">
      ${img ? `<img class="exercise-thumb" src="${img}" alt="${exercise.name}">` : ``}
      <div class="exercise-card-content">
        <div class="exercise-card-header">
          <div class="exercise-card-title">${exercise.name}</div>
          <div class="exercise-card-category">${exercise.category}</div>
        </div>
        <div class="exercise-card-info">
          <div class="exercise-info-item">
            <span class="exercise-info-value">${exercise.type || 'strength'}</span>
            <span class="exercise-info-label">Type</span>
          </div>
          <div class="exercise-info-item">
            <span class="exercise-info-value">${(exercise.muscleGroups || []).length}</span>
            <span class="exercise-info-label">Muscles</span>
          </div>
          <div class="exercise-info-item">
            <span class="exercise-info-value">${muscleList || '—'}</span>
            <span class="exercise-info-label">Targets</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

    // Load exercises list for master management
    function loadExercisesList() {
        const filterCategory = $('#filter-category').val();
        let filteredExercises = exercises;
        
        if (filterCategory) {
            filteredExercises = exercises.filter(ex => ex.category === filterCategory);
        }

        let exercisesHtml = '';
        filteredExercises.forEach(exercise => {
            exercisesHtml += `
                <div class="exercise-master-item">
                    <div class="exercise-master-header">
                        <div class="exercise-master-name">${exercise.name}</div>
                        <div class="exercise-master-category">${exercise.category}</div>
                    </div>
                    <div class="exercise-master-muscles">
                        ${exercise.muscleGroups.map(mg => `<span class="muscle-tag">${mg}</span>`).join('')}
                    </div>
                </div>
            `;
        });

        if (exercisesHtml === '') {
            exercisesHtml = '<p class="text-center">No exercises found in this category.</p>';
        }

        $('#exercises-list-master').html(exercisesHtml);
    }

    // Update current workout display
    function updateCurrentWorkoutDisplay() {
        const today = new Date().toISOString().split('T')[0];
        const todayWorkouts = workouts.filter(w => w.date === today);
        
        if (todayWorkouts.length === 0) {
            $('#current-workout-exercises').addClass('hidden');
            return;
        }

        let exercisesHtml = '';
        todayWorkouts.forEach(workout => {
            exercisesHtml += `
                <div class="exercise-item">
                    <div class="exercise-item-header">
                        <span class="exercise-item-name">${workout.exerciseName}</span>
                        <span class="exercise-item-category">${workout.category}</span>
                    </div>
                    <div class="exercise-item-details">
                        ${formatExerciseDetails(workout)}
                    </div>
                </div>
            `;
        });

        $('#exercises-list').html(exercisesHtml);
        $('#current-workout-exercises').removeClass('hidden');
    }

    // Format exercise details for display
    function formatExerciseDetails(exercise) {
        if (exercise.type === 'rest') {
            return exercise.notes || 'Rest day logged';
        } else if (exercise.type === 'strength' && exercise.sets) {
            return `${exercise.sets.length} sets: ${exercise.sets.map(s => `${s.reps}×${s.weight}kg`).join(', ')}`;
        } else if (exercise.type === 'cardio') {
            return `${exercise.duration} min, ${exercise.distance || 'N/A'}km`;
        } else if (exercise.type === 'swimming') {
            return `${exercise.laps} laps, ${exercise.totalTime || 'N/A'} min`;
        } else if (exercise.type === 'mobility') {
            return `${exercise.duration} min, ${exercise.intensity} intensity`;
        }
        return '';
    }

    // Update streak counter
    function updateStreakCounter() {
        const streak = calculateWorkoutStreak();
        $('#streak-display').text(`Streak: ${streak} days`);
    }

    // Calculate workout streak
    function calculateWorkoutStreak() {
        if (workouts.length === 0) return 0;

        const workoutDates = [...new Set(workouts.map(w => w.date))].sort().reverse();
        const today = new Date().toISOString().split('T')[0];

        let streak = 0;
        let currentDate = new Date(today);

        for (let i = 0; i < workoutDates.length; i++) {
            const workoutDate = workoutDates[i];
            const expectedDate = currentDate.toISOString().split('T')[0];

            if (workoutDate === expectedDate) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (workoutDate < expectedDate) {
                break;
            }
        }

        return streak;
    }

    // Show toast notification
    function showToast(message, type = 'success') {
        const $toast = $('#toast');
        const $toastMessage = $('#toast-message');
        
        $toastMessage.text(message);
        $toast.removeClass('error');
        
        if (type === 'error') {
            $toast.addClass('error');
        }
        
        $toast.removeClass('hidden');
        
        setTimeout(() => {
            $toast.addClass('hidden');
        }, 3000);
    }

    // Initialize the application
    initApp();
});

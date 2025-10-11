$(document).ready(function() {
     // Global variables
        let exercises = [];
        let workouts = [];
        let exerciseIdCounter = 1;
        let workoutIdCounter = 1;
        
        // Sample data
        // const sampleExercises = [
        //     {id: 1, name: "Bench Press", category: "Upper Body", muscleGroups: ["Chest", "Triceps", "Shoulders"], type: "strength", image: ""},
        //     {id: 2, name: "Squats", category: "Lower Body", muscleGroups: ["Quadriceps", "Glutes", "Core"], type: "strength", image: ""},
        //     {id: 3, name: "Treadmill", category: "Cardio", muscleGroups: ["Legs", "Cardiovascular"], type: "cardio", image: ""},
        //     {id: 4, name: "Freestyle Swimming", category: "Swimming", muscleGroups: ["Full Body", "Cardiovascular"], type: "swimming", image: ""},
        //     {id: 5, name: "Plank", category: "Core", muscleGroups: ["Core", "Shoulders"], type: "strength", image: ""},
        //     {id: 6, name: "Dynamic Stretching", category: "Mobility", muscleGroups: ["Full Body"], type: "mobility", image: ""},
        //     {id: 7, name: "Deadlift", category: "Lower Body", muscleGroups: ["Hamstrings", "Glutes", "Back"], type: "strength", image: ""},
        //     {id: 8, name: "Pull-ups", category: "Upper Body", muscleGroups: ["Back", "Biceps"], type: "strength", image: ""},
        //     {id: 9, name: "Cycling", category: "Cardio", muscleGroups: ["Legs", "Cardiovascular"], type: "cardio", image: ""},
        //     {id: 10, name: "Backstroke Swimming", category: "Swimming", muscleGroups: ["Full Body", "Cardiovascular"], type: "swimming", image: ""}
        // ];
        
        const sampleWorkouts = [
            {
                id: 1, date: "2024-10-10", exerciseId: 1, exerciseName: "Bench Press", category: "Upper Body", type: "strength",
                sets: [{setNumber: 1, reps: 12, weight: 60}, {setNumber: 2, reps: 10, weight: 70}, {setNumber: 3, reps: 8, weight: 80}]
            },
            {
                id: 2, date: "2024-10-09", exerciseId: 3, exerciseName: "Treadmill", category: "Cardio", type: "cardio",
                duration: 30, distance: 5.2, pace: 5.77, incline: 2
            }
        ];
        
        const exerciseCategories = ["Upper Body", "Lower Body", "Core", "Mobility", "Cardio", "Swimming", "Rest Day"];
        const muscleGroups = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quadriceps", "Hamstrings", "Glutes", "Calves", "Core", "Full Body", "Cardiovascular"];
        const poolLengths = ["25m", "50m", "Other"];
        const strokeTypes = ["Freestyle", "Backstroke", "Breaststroke", "Butterfly"];
        const intensityLevels = ["Light", "Moderate", "Intense"];
        
        // Initialize app
        $(document).ready(function() {
            loadData();
            initializeApp();
            populateDropdowns();
            renderExercises();
            updateStorageStats();
            
            // Set default date to today
            $('#workoutDate').val(new Date().toISOString().split('T')[0]);
        });
        
        // Load data from in-memory storage (localStorage not available in sandbox)
        function loadData() {
            // Initialize with sample data
			
			
			const exercisesData = localStorage.getItem('exercises');
			const workoutsData = localStorage.getItem('workouts');
			exercises = exercisesData ? JSON.parse(exercisesData) : sampleExercises;
			workouts = workoutsData ? JSON.parse(workoutsData) : sampleWorkouts;
			
            exercises = [...exercises];
            workouts = [...workouts];
			
			
            //exercises = [...sampleExercises];
            //workouts = [...sampleWorkouts];
            exerciseIdCounter = 11;
            workoutIdCounter = 3;
        }
        
        // Save data to in-memory storage (localStorage not available in sandbox)
        function saveData() {
            // Data is already saved in memory
			localStorage.setItem('exercises', JSON.stringify(exercises));
    		localStorage.setItem('workouts', JSON.stringify(workouts));
            updateStorageStats();
        }
        
        // Initialize app components
        function initializeApp() {
            // Search functionality
            $('#searchInput').on('input', function() {
                renderExercises();
            });
            
            $('#categoryFilter').on('change', function() {
                renderExercises();
            });
            
            $('#clearFilters').on('click', function() {
                $('#searchInput').val('');
                $('#categoryFilter').val('');
                renderExercises();
            });
            
            // Exercise form
            $('#exerciseForm').on('submit', handleExerciseSubmit);
            $('#exerciseImage').on('change', handleImageUpload);
            $('#exerciseImageUrl').on('input', handleImageUrl);
            
            // Workout form
            $('#workoutForm').on('submit', handleWorkoutSubmit);
            $('#exerciseSelect').on('change', function() {
                const exerciseId = parseInt($(this).val());
                const exercise = exercises.find(e => e.id === exerciseId);
                if (exercise) {
                    generateDynamicFields(exercise);
                }
            });
            
            $('#resetForm').on('click', function() {
                $('#workoutForm')[0].reset();
                $('#dynamicFields').empty();
                $('#workoutDate').val(new Date().toISOString().split('T')[0]);
            });
            
            // Data management
            $('#exportData').on('click', exportData);
            $('#importData').on('click', function() { $('#importFile').click(); });
            $('#importFile').on('change', importData);
            $('#clearAllData').on('click', clearAllData);
        }
        
        // Populate dropdown menus
        function populateDropdowns() {
            // Category filters
            exerciseCategories.forEach(category => {
                $('#categoryFilter').append(`<option value="${category}">${category}</option>`);
                $('#exerciseCategory').append(`<option value="${category}">${category}</option>`);
            });
            
            // Muscle groups
            muscleGroups.forEach(muscle => {
                $('#exerciseMuscles').append(`<option value="${muscle}">${muscle}</option>`);
            });
            
            // Exercise select for workout entry
            updateExerciseSelect();
        }
        
        // Update exercise select dropdown
        function updateExerciseSelect() {
            $('#exerciseSelect').empty().append('<option value="">Select an exercise</option>');
            exercises.forEach(exercise => {
                $('#exerciseSelect').append(`<option value="${exercise.id}">${exercise.name} (${exercise.category})</option>`);
            });
        }
        
        // Render exercises in search results
        function renderExercises() {
            const searchTerm = $('#searchInput').val().toLowerCase();
            const categoryFilter = $('#categoryFilter').val();
            
            let filteredExercises = exercises.filter(exercise => {
                const matchesSearch = exercise.name.toLowerCase().includes(searchTerm) || 
                                    exercise.category.toLowerCase().includes(searchTerm) ||
                                    exercise.muscleGroups.some(mg => mg.toLowerCase().includes(searchTerm));
                const matchesCategory = !categoryFilter || exercise.category === categoryFilter;
                return matchesSearch && matchesCategory;
            });
            
            const resultsContainer = $('#exerciseResults');
            resultsContainer.empty();
            
            if (filteredExercises.length === 0) {
                resultsContainer.append(`
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-search" style="font-size: 3rem; opacity: 0.5;"></i>
                        <h4 class="mt-3 text-muted">No exercises found</h4>
                        <p class="text-muted">Try adjusting your search criteria</p>
                    </div>
                `);
                return;
            }
            
            filteredExercises.forEach(exercise => {
                const imageHtml = exercise.image ? 
                    `<img src="${exercise.image}" class="exercise-image mb-2" alt="${exercise.name}">` :
                    `<div class="exercise-image mb-2 d-flex align-items-center justify-content-center bg-secondary rounded">
                        <i class="bi bi-image" style="font-size: 2rem; opacity: 0.5;"></i>
                    </div>`;
                
                const muscleGroupBadges = exercise.muscleGroups.map(mg => 
                    `<span class="badge bg-info me-1 mb-1">${mg}</span>`
                ).join('');
                
                const exerciseCard = `
                    <div class="col-12 mb-3">
                        <div class="card exercise-card" data-exercise-id="${exercise.id}" style="cursor: pointer;">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-3">
                                        ${imageHtml}
                                    </div>
                                    <div class="col-md-9">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <h5 class="card-title mb-0">${exercise.name}</h5>
                                            <span class="badge bg-primary">${exercise.category}</span>
                                        </div>
                                        <p class="card-text">
                                            <strong>Type:</strong> <span class="badge bg-secondary">${exercise.type}</span>
                                        </p>
                                        <div class="mb-2">
                                            <strong>Muscle Groups:</strong><br>
                                            ${muscleGroupBadges}
                                        </div>
                                        <div class="text-end">
                                            <small class="text-muted">Click for details & personal records</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                resultsContainer.append(exerciseCard);
            });
            
            // Add click handlers for exercise cards
            $('.exercise-card').on('click', function() {
                const exerciseId = parseInt($(this).data('exercise-id'));
                showExerciseDetails(exerciseId);
            });
        }
        
        // Show exercise details modal
        function showExerciseDetails(exerciseId) {
            const exercise = exercises.find(e => e.id === exerciseId);
            if (!exercise) return;
            
            const exerciseWorkouts = workouts.filter(w => w.exerciseId === exerciseId);
            const lastWorkout = exerciseWorkouts.length > 0 ? exerciseWorkouts[exerciseWorkouts.length - 1] : null;
            
            let personalRecords = calculatePersonalRecords(exerciseId);
            
            $('#exerciseModalTitle').text(exercise.name);
            
            let modalBody = `
                <div class="row mb-4">
                    <div class="col-md-4">
                        ${exercise.image ? 
                            `<img src="${exercise.image}" class="img-fluid rounded" alt="${exercise.name}">` :
                            `<div class="bg-secondary rounded d-flex align-items-center justify-content-center" style="height: 200px;">
                                <i class="bi bi-image" style="font-size: 3rem; opacity: 0.5;"></i>
                            </div>`
                        }
                    </div>
                    <div class="col-md-8">
                        <p><strong>Category:</strong> <span class="badge bg-primary">${exercise.category}</span></p>
                        <p><strong>Type:</strong> <span class="badge bg-secondary">${exercise.type}</span></p>
                        <p><strong>Muscle Groups:</strong><br>
                            ${exercise.muscleGroups.map(mg => `<span class="badge bg-info me-1">${mg}</span>`).join('')}
                        </p>
                        <p><strong>Total Workouts:</strong> ${exerciseWorkouts.length}</p>
                    </div>
                </div>
            `;
            
            if (personalRecords.length > 0) {
                modalBody += `
                    <div class="row mb-4">
                        <div class="col-12">
                            <h5><i class="bi bi-trophy"></i> Personal Records</h5>
                            <div class="row">
                                ${personalRecords.map(pr => `
                                    <div class="col-md-6 col-lg-4 mb-2">
                                        <span class="badge pr-badge">${pr.label}: ${pr.value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }
            
            if (lastWorkout) {
                modalBody += `
                    <div class="row">
                        <div class="col-12">
                            <h5><i class="bi bi-clock-history"></i> Last Workout (${lastWorkout.date})</h5>
                            <div class="card">
                                <div class="card-body">
                                    ${formatWorkoutDetails(lastWorkout)}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                modalBody += `
                    <div class="row">
                        <div class="col-12">
                            <div class="text-center py-4 text-muted">
                                <i class="bi bi-clipboard-x" style="font-size: 2rem;"></i>
                                <h6 class="mt-2">No workout history yet</h6>
                                <p>Start logging workouts to see your progress!</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            $('#exerciseModalBody').html(modalBody);
            
            const modal = new bootstrap.Modal(document.getElementById('exerciseDetailsModal'));
            modal.show();
        }
        
        // Calculate personal records for an exercise
        function calculatePersonalRecords(exerciseId) {
            const exerciseWorkouts = workouts.filter(w => w.exerciseId === exerciseId);
            if (exerciseWorkouts.length === 0) return [];
            
            const exercise = exercises.find(e => e.id === exerciseId);
            const records = [];
            
            if (exercise.type === 'strength') {
                // Max weight
                const maxWeight = Math.max(...exerciseWorkouts.flatMap(w => w.sets ? w.sets.map(s => s.weight || 0) : [0]));
                if (maxWeight > 0) records.push({label: 'Max Weight', value: `${maxWeight} lbs`});
                
                // Max reps at any weight
                const maxReps = Math.max(...exerciseWorkouts.flatMap(w => w.sets ? w.sets.map(s => s.reps || 0) : [0]));
                if (maxReps > 0) records.push({label: 'Max Reps', value: maxReps});
                
                // Best volume (weight × reps)
                const maxVolume = Math.max(...exerciseWorkouts.flatMap(w => w.sets ? w.sets.map(s => (s.weight || 0) * (s.reps || 0)) : [0]));
                if (maxVolume > 0) records.push({label: 'Best Set Volume', value: `${maxVolume} lbs×reps`});
                
            } else if (exercise.type === 'cardio') {
                // Best distance
                const maxDistance = Math.max(...exerciseWorkouts.map(w => w.distance || 0));
                if (maxDistance > 0) records.push({label: 'Longest Distance', value: `${maxDistance} miles`});
                
                // Longest duration
                const maxDuration = Math.max(...exerciseWorkouts.map(w => w.duration || 0));
                if (maxDuration > 0) records.push({label: 'Longest Duration', value: `${maxDuration} min`});
                
                // Best pace (lowest)
                const bestPace = Math.min(...exerciseWorkouts.map(w => w.pace || Infinity).filter(p => p !== Infinity));
                if (bestPace !== Infinity) records.push({label: 'Best Pace', value: `${bestPace} min/mile`});
                
            } else if (exercise.type === 'swimming') {
                // Most laps
                const maxLaps = Math.max(...exerciseWorkouts.map(w => w.laps || 0));
                if (maxLaps > 0) records.push({label: 'Most Laps', value: maxLaps});
                
                // Longest duration
                const maxDuration = Math.max(...exerciseWorkouts.map(w => w.duration || 0));
                if (maxDuration > 0) records.push({label: 'Longest Swim', value: `${maxDuration} min`});
                
                // Best pace (lowest)
                const bestPace = Math.min(...exerciseWorkouts.map(w => w.lapTime || Infinity).filter(p => p !== Infinity));
                if (bestPace !== Infinity) records.push({label: 'Best Lap Time', value: `${bestPace} sec/lap`});
            }
            
            return records;
        }
        
        // Format workout details for display
        function formatWorkoutDetails(workout) {
            if (workout.type === 'strength' && workout.sets) {
                let html = '<div class="table-responsive"><table class="table table-sm table-dark"><thead><tr><th>Set</th><th>Reps</th><th>Weight (lbs)</th></tr></thead><tbody>';
                workout.sets.forEach(set => {
                    html += `<tr><td>${set.setNumber}</td><td>${set.reps}</td><td>${set.weight}</td></tr>`;
                });
                html += '</tbody></table></div>';
                return html;
            } else if (workout.type === 'cardio') {
                return `
                    <div class="row">
                        <div class="col-6"><strong>Duration:</strong> ${workout.duration} min</div>
                        <div class="col-6"><strong>Distance:</strong> ${workout.distance} miles</div>
                        <div class="col-6"><strong>Pace:</strong> ${workout.pace} min/mile</div>
                        <div class="col-6"><strong>Incline:</strong> ${workout.incline}%</div>
                    </div>
                `;
            } else if (workout.type === 'swimming') {
                return `
                    <div class="row">
                        <div class="col-6"><strong>Laps:</strong> ${workout.laps}</div>
                        <div class="col-6"><strong>Duration:</strong> ${workout.duration} min</div>
                        <div class="col-6"><strong>Pool Length:</strong> ${workout.poolLength}</div>
                        <div class="col-6"><strong>Stroke:</strong> ${workout.stroke}</div>
                        <div class="col-12"><strong>Lap Time:</strong> ${workout.lapTime} sec/lap</div>
                    </div>
                `;
            } else if (workout.type === 'mobility') {
                return `
                    <div class="row">
                        <div class="col-6"><strong>Duration:</strong> ${workout.duration} min</div>
                        <div class="col-6"><strong>Intensity:</strong> ${workout.intensity}</div>
                        <div class="col-12"><strong>Notes:</strong> ${workout.notes || 'No notes'}</div>
                    </div>
                `;
            }
            return '<p>No details available</p>';
        }
        
        // Generate dynamic form fields based on exercise type
        function generateDynamicFields(exercise) {
            const container = $('#dynamicFields');
            container.empty();
            
            if (exercise.type === 'strength') {
                container.append(`
                    <div class="row mb-3">
                        <div class="col-12">
                            <h5><i class="bi bi-plus-circle"></i> Sets</h5>
                            <div id="setsContainer"></div>
                            <button type="button" class="btn btn-outline-primary btn-sm" id="addSetBtn">
                                <i class="bi bi-plus"></i> Add Set
                            </button>
                        </div>
                    </div>
                `);
                
                $('#addSetBtn').on('click', addSet);
                addSet(); // Add first set by default
                
            } else if (exercise.type === 'cardio') {
                container.append(`
                    <div class="row mb-3">
                        <div class="col-md-3">
                            <label for="duration" class="form-label">Duration (min) *</label>
                            <input type="number" class="form-control" id="duration" min="0" step="0.1" required>
                        </div>
                        <div class="col-md-3">
                            <label for="distance" class="form-label">Distance (miles)</label>
                            <input type="number" class="form-control" id="distance" min="0" step="0.1">
                        </div>
                        <div class="col-md-3">
                            <label for="pace" class="form-label">Pace (min/mile)</label>
                            <input type="number" class="form-control" id="pace" min="0" step="0.1">
                        </div>
                        <div class="col-md-3">
                            <label for="incline" class="form-label">Incline (%)</label>
                            <input type="number" class="form-control" id="incline" min="0" step="0.1">
                        </div>
                    </div>
                `);
                
            } else if (exercise.type === 'swimming') {
                container.append(`
                    <div class="row mb-3">
                        <div class="col-md-3">
                            <label for="laps" class="form-label">Laps *</label>
                            <input type="number" class="form-control" id="laps" min="0" required>
                        </div>
                        <div class="col-md-3">
                            <label for="duration" class="form-label">Duration (min) *</label>
                            <input type="number" class="form-control" id="duration" min="0" step="0.1" required>
                        </div>
                        <div class="col-md-3">
                            <label for="poolLength" class="form-label">Pool Length</label>
                            <select class="form-select" id="poolLength">
                                ${poolLengths.map(length => `<option value="${length}">${length}</option>`).join('')}
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="stroke" class="form-label">Stroke Type</label>
                            <select class="form-select" id="stroke">
                                ${strokeTypes.map(stroke => `<option value="${stroke}">${stroke}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="lapTime" class="form-label">Average Lap Time (sec)</label>
                            <input type="number" class="form-control" id="lapTime" min="0" step="0.1">
                        </div>
                    </div>
                `);
                
            } else if (exercise.type === 'mobility') {
                container.append(`
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label for="duration" class="form-label">Duration (min) *</label>
                            <input type="number" class="form-control" id="duration" min="0" step="0.1" required>
                        </div>
                        <div class="col-md-4">
                            <label for="intensity" class="form-label">Intensity</label>
                            <select class="form-select" id="intensity">
                                ${intensityLevels.map(level => `<option value="${level}">${level}</option>`).join('')}
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label for="notes" class="form-label">Notes</label>
                            <textarea class="form-control" id="notes" rows="1"></textarea>
                        </div>
                    </div>
                `);
            }
        }
        
        // Add set function for strength exercises
        function addSet() {
            const setNumber = $('#setsContainer .set-row').length + 1;
            const setHtml = `
                <div class="set-row">
                    <div class="row align-items-end">
                        <div class="col-2">
                            <label class="form-label">Set ${setNumber}</label>
                            <input type="text" class="form-control" value="Set ${setNumber}" readonly>
                        </div>
                        <div class="col-4">
                            <label class="form-label">Reps *</label>
                            <input type="number" class="form-control reps-input" min="0" required>
                        </div>
                        <div class="col-4">
                            <label class="form-label">Weight (lbs) *</label>
                            <input type="number" class="form-control weight-input" min="0" step="0.5" required>
                        </div>
                        <div class="col-2">
                            <button type="button" class="btn btn-outline-danger btn-sm w-100 remove-set-btn" 
                                    ${setNumber === 1 ? 'style="display: none;"' : ''}>
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            $('#setsContainer').append(setHtml);
            
            // Update set numbers and remove button handlers
            updateSetNumbers();
            
            $('.remove-set-btn').off('click').on('click', function() {
                $(this).closest('.set-row').remove();
                updateSetNumbers();
            });
        }
        
        // Update set numbers after adding/removing sets
        function updateSetNumbers() {
            $('#setsContainer .set-row').each(function(index) {
                const setNumber = index + 1;
                $(this).find('input[readonly]').val(`Set ${setNumber}`);
                $(this).find('label').first().text(`Set ${setNumber}`);
                
                // Show/hide remove button (first set shouldn't have remove button)
                const removeBtn = $(this).find('.remove-set-btn');
                if (setNumber === 1) {
                    removeBtn.hide();
                } else {
                    removeBtn.show();
                }
            });
        }
        
        // Handle exercise form submission
        function handleExerciseSubmit(e) {
            e.preventDefault();
            
            const formData = {
                id: exerciseIdCounter++,
                name: $('#exerciseName').val().trim(),
                category: $('#exerciseCategory').val(),
                type: $('#exerciseType').val(),
                muscleGroups: $('#exerciseMuscles').val() || [],
                image: $('#imagePreview img').attr('src') || ''
            };
            
            // Validation
            if (!formData.name || !formData.category || !formData.type) {
                showAlert('Please fill in all required fields', 'danger');
                return;
            }
            
            // Check for duplicate names
            if (exercises.some(ex => ex.name.toLowerCase() === formData.name.toLowerCase())) {
                showAlert('An exercise with this name already exists', 'danger');
                return;
            }
            
            exercises.push(formData);
            saveData();
            updateExerciseSelect();
            renderExercises();
            
            // Reset form
            $('#exerciseForm')[0].reset();
            $('#imagePreview').empty();
            
            showAlert('Exercise added successfully!', 'success');
        }
        
        // Handle workout form submission
        function handleWorkoutSubmit(e) {
            e.preventDefault();
            
            const exerciseId = parseInt($('#exerciseSelect').val());
            const exercise = exercises.find(e => e.id === exerciseId);
            
            if (!exercise) {
                showAlert('Please select an exercise', 'danger');
                return;
            }
            
            const workoutData = {
                id: workoutIdCounter++,
                date: $('#workoutDate').val(),
                exerciseId: exercise.id,
                exerciseName: exercise.name,
                category: exercise.category,
                type: exercise.type
            };
            
            // Validation and data collection based on exercise type
            if (exercise.type === 'strength') {
                const sets = [];
                let isValid = true;
                
                $('#setsContainer .set-row').each(function(index) {
                    const reps = parseInt($(this).find('.reps-input').val());
                    const weight = parseFloat($(this).find('.weight-input').val());
                    
                    if (!reps || !weight || reps <= 0 || weight <= 0) {
                        isValid = false;
                        return false;
                    }
                    
                    sets.push({
                        setNumber: index + 1,
                        reps: reps,
                        weight: weight
                    });
                });
                
                if (!isValid || sets.length === 0) {
                    showAlert('Please fill in all sets with valid values', 'danger');
                    return;
                }
                
                workoutData.sets = sets;
                
            } else if (exercise.type === 'cardio') {
                const duration = parseFloat($('#duration').val());
                if (!duration || duration <= 0) {
                    showAlert('Please enter a valid duration', 'danger');
                    return;
                }
                
                workoutData.duration = duration;
                workoutData.distance = parseFloat($('#distance').val()) || 0;
                workoutData.pace = parseFloat($('#pace').val()) || 0;
                workoutData.incline = parseFloat($('#incline').val()) || 0;
                
            } else if (exercise.type === 'swimming') {
                const laps = parseInt($('#laps').val());
                const duration = parseFloat($('#duration').val());
                
                if (!laps || !duration || laps <= 0 || duration <= 0) {
                    showAlert('Please enter valid laps and duration', 'danger');
                    return;
                }
                
                workoutData.laps = laps;
                workoutData.duration = duration;
                workoutData.poolLength = $('#poolLength').val();
                workoutData.stroke = $('#stroke').val();
                workoutData.lapTime = parseFloat($('#lapTime').val()) || 0;
                
            } else if (exercise.type === 'mobility') {
                const duration = parseFloat($('#duration').val());
                if (!duration || duration <= 0) {
                    showAlert('Please enter a valid duration', 'danger');
                    return;
                }
                
                workoutData.duration = duration;
                workoutData.intensity = $('#intensity').val();
                workoutData.notes = $('#notes').val().trim();
            }
            
            workouts.push(workoutData);
            saveData();
            
            // Reset form
            $('#workoutForm')[0].reset();
            $('#dynamicFields').empty();
            $('#workoutDate').val(new Date().toISOString().split('T')[0]);
            
            showAlert('Workout saved successfully!', 'success');
        }
        
        // Handle image upload
        function handleImageUpload(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    showAlert('Image file size must be less than 5MB', 'danger');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageUrl = e.target.result;
                    $('#imagePreview').html(`<img src="${imageUrl}" class="image-preview" alt="Preview">`);
                    $('#exerciseImageUrl').val(''); // Clear URL field
                };
                reader.readAsDataURL(file);
            }
        }
        
        // Handle image URL input
        function handleImageUrl() {
            const url = $('#exerciseImageUrl').val().trim();
            if (url) {
                $('#imagePreview').html(`<img src="${url}" class="image-preview" alt="Preview" 
                    onerror="this.style.display='none'; $('#imagePreview').html('<div class=\"alert alert-warning\">Invalid image URL</div>');">`);                $('#exerciseImage').val(''); // Clear file input
            } else {
                $('#imagePreview').empty();
            }
        }
        
        // Show alert message
        function showAlert(message, type) {
            const alertHtml = `
                <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                    ${message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            
            $('#alert-container').html(alertHtml);
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                $('.alert').alert('close');
            }, 5000);
        }
        
        // Export data
        function exportData() {
            const data = {
                exercises: exercises,
                workouts: workouts,
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `gym-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showAlert('Data exported successfully!', 'success');
        }
        
        // Import data
        function importData(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (data.exercises && data.workouts) {
                        exercises = data.exercises;
                        workouts = data.workouts;
                        
                        // Update ID counters
                        exerciseIdCounter = Math.max(...exercises.map(ex => ex.id), 0) + 1;
                        workoutIdCounter = Math.max(...workouts.map(w => w.id), 0) + 1;
                        
                        saveData();
                        updateExerciseSelect();
                        renderExercises();
                        
                        showAlert('Data imported successfully!', 'success');
                    } else {
                        throw new Error('Invalid data format');
                    }
                } catch (error) {
                    showAlert('Error importing data. Please check the file format.', 'danger');
                }
            };
            reader.readAsText(file);
            
            // Reset file input
            $('#importFile').val('');
        }
        
        // Clear all data
        function clearAllData() {
            if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                localStorage.removeItem('exercises');
				localStorage.removeItem('workouts');
				// Reset in-memory variables to sample data
				exercises = [...sampleExercises];
				workouts = [...sampleWorkouts];
				saveData();         // update localStorage (if needed for session)
				updateExerciseSelect();
				renderExercises();
				showAlert('All data cleared and reset to defaults', 'success');
            }
        }
        
        // Update session statistics
        function updateStorageStats() {
            const exerciseCount = exercises.length;
            const workoutCount = workouts.length;
            const memorySize = ((JSON.stringify(exercises).length + JSON.stringify(workouts).length) / 1024).toFixed(2);
            
            $('#storageStats').html(`
                <div class="row text-center">
                    <div class="col-4">
                        <div class="badge bg-info">${exerciseCount}</div>
                        <div class="small">Exercises</div>
                    </div>
                    <div class="col-4">
                        <div class="badge bg-success">${workoutCount}</div>
                        <div class="small">Workouts</div>
                    </div>
                    <div class="col-4">
                        <div class="badge bg-warning">${memorySize} KB</div>
                        <div class="small">In Memory</div>
                    </div>
                </div>
            `);
        }
});

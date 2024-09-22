// import React, { useEffect, useState } from 'react';
// import { Button, Card, CardContent, Typography, LinearProgress } from '@mui/material';
// import { Container, Row, Col } from 'react-bootstrap';
// import Cookies from 'js-cookie';
// import apiService from '../../../apiService';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// const LMS_dash = () => {
//   const internID = Cookies.get('internID');
//   const [courses, setCourses] = useState([]);
//   const [courseStatus, setCourseStatus] = useState({});
//   const [currentMaterials, setCurrentMaterials] = useState({});

//   useEffect(() => {
//     if (internID) {
//       fetchCoursesForIntern();
//     }
//   }, [internID]);


//   useEffect(() => {
//     console.log("Updated currentMaterials:", currentMaterials);
//   }, [currentMaterials]);


  // const fetchCoursesForIntern = async () => {
  //   try {
  //     const response = await apiService.get(`/api/intern-courses/${internID}`);
  //     setCourses(response.data);
  //     console.log("Fetched courses:", response.data);

  //     fetchProgressForIntern(response.data);
  //   } catch (error) {
  //     console.error('Error fetching courses:', error);
  //   }
  // };

  // const fetchProgressForIntern = async (fetchedCourses) => {
  //   try {
  //     const response = await apiService.get(`/api/intern-progress/${internID}`);
  //     const courseStatus = response.data.course_status;

  //     const initialMaterials = {};
  //     fetchedCourses.forEach(course => {
  //       const materialsStatus = courseStatus[course.id] || {};
  //       const materialKeys = Object.keys(materialsStatus);
  //       const firstFalseIndex = materialKeys.findIndex(key => !materialsStatus[key]);

  //       // Set the count of completed materials or the index of the first locked material
  //       initialMaterials[course.id] = firstFalseIndex === -1 ? materialKeys.length : firstFalseIndex;

  //       // Log available materials for the current course
  //       console.log(`Course ID: ${course.id}`);
  //       materialKeys.forEach(key => {
  //         const isUnlocked = materialKeys.indexOf(key) <= initialMaterials[course.id];
  //         if (isUnlocked) {
  //           console.log(`Material ID: ${key}, Status: ${materialsStatus[key] ? 'Completed' : 'Unlocked'}`);
  //         } else {
  //           console.log(`Material ID: ${key}, Status: Locked`);
  //         }
  //       });
  //     });

  //     console.log("initialMaterials :", initialMaterials);
  //     setCourseStatus(courseStatus);
  //     setCurrentMaterials(initialMaterials);
  //   } catch (error) {
  //     console.error('Error fetching course progress:', error);
  //   }
  // };




//   const handleCompleteMaterial = async (courseId, materialId) => {
//     // Check if the material ID is valid
//     if (materialId === undefined) {
//       console.error("Material ID is undefined. Cannot update progress.");
//       return;
//     }

//     // Update local courseStatus to include false for all materials
//     const updatedCourseStatus = {
//       ...courseStatus,
//       [courseId]: {
//         ...courseStatus[courseId],
//         [materialId]: true, // Mark the current material as completed
//       },
//     };

//     // Ensure all other materials are marked as false if they are not completed
//     const courseMaterials = courses.find(course => course.id === courseId)?.material || [];
//     courseMaterials.forEach(file => {
//       if (file.materialID !== materialId) {
//         updatedCourseStatus[courseId][file.materialID] = false; // Set others to false
//       }
//     });

//     // Update currentMaterials to unlock the next material
//     setCurrentMaterials(prev => {
//       const currentIndex = courseMaterials.findIndex(material => material.materialID === materialId);
//       const newCount = Math.min(currentIndex + 2, courseMaterials.length);
//       console.log(`Updating currentMaterials for course ${courseId}: ${newCount}`);
//       return {
//         ...prev,
//         [courseId]: newCount,
//       };
//     });

//     setCourseStatus(updatedCourseStatus); // Update course status

//     // Send updated status to backend
//     try {
//       await apiService.post('/api/update-progress', {
//         internID,
//         progress: updatedCourseStatus,
//       });
//     } catch (error) {
//       console.error('Error updating progress in the backend:', error);
//     }
//   };

//   return (
//     <Container>
//       <Row>
//         <Col>
//           <Typography variant="h4" sx={{ margin: '20px 0' }}>Your Courses</Typography>
//           {courses.length === 0 ? (
//             <Typography variant="body1" color="textSecondary">
//               No courses available for your domain.
//             </Typography>
//           ) : (
//             courses.map((course) => (
//               <Card key={course.id} sx={{ marginBottom: '20px', boxShadow: 3 }}>
//                 <CardContent>
//                   <Typography variant="h6" sx={{ marginBottom: '10px' }}>{course.course_name}</Typography>

//                   {course.material.map((file, materialIndex) => {
//                     const isCompleted = courseStatus[course.id]?.[file.materialID];
//                     const isUnlocked = materialIndex < currentMaterials[course.id] || isCompleted;

//                     return (
//                       <div key={materialIndex} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
//                         {isUnlocked ? (
//                           <>
//                             <a
//                               href={`http://localhost:5000${file.url}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               style={{ textDecoration: 'none', color: '#1976d2', flexGrow: 1 }}
//                             >
//                               {file.name}
//                             </a>
//                             {isCompleted && (
//                               <CheckCircleIcon sx={{ color: 'green', marginLeft: '10px' }} />
//                             )}
//                           </>
//                         ) : (
//                           <Typography variant="body2" color="textSecondary" style={{ flexGrow: 1 }}>
//                             <i className="fa fa-lock" aria-hidden="true"></i> {file.name}
//                           </Typography>
//                         )}

//                         {/* Mark as completed button */}
//                         {isUnlocked && !isCompleted && (
//                           <Button
//                             variant="outlined"
//                             color="primary"
//                             onClick={() => handleCompleteMaterial(course.id, file.materialID)}
//                             sx={{ marginLeft: '10px' }}
//                           >
//                             Mark as Completed
//                           </Button>
//                         )}

//                         {/* Completed status */}
//                         {isCompleted && (
//                           <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
//                             <LinearProgress variant="determinate" value={100} sx={{ width: '100px' }} />
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}


//                   {/* Quiz at the end of the course */}
//                   {course.material.every((file) => courseStatus[course.id]?.[file.materialID]) && (
//                     <div style={{ marginTop: '20px' }}>
//                       <Button
//                         variant="contained"
//                         color="secondary"
//                         href={`/quiz/${course.id}`}
//                       >
//                         Take Course Quiz
//                       </Button>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default LMS_dash;

import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, Typography, LinearProgress } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import Cookies from 'js-cookie';
import apiService from '../../../apiService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const LMS_dash = () => {
  const internID = Cookies.get('internID');
  const [courses, setCourses] = useState([]);
  const [courseStatus, setCourseStatus] = useState({});
  const [currentMaterials, setCurrentMaterials] = useState({});

  useEffect(() => {
    if (internID) {
      fetchCoursesForIntern();
    }
  }, [internID]);

  useEffect(() => {
    console.log("Updated currentMaterials:", currentMaterials);
  }, [currentMaterials]);

  const fetchCoursesForIntern = async () => {
    try {
      const response = await apiService.get(`/api/intern-courses/${internID}`);
      setCourses(response.data);
      console.log("Fetched courses:", response.data);

      fetchProgressForIntern(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchProgressForIntern = async (fetchedCourses) => {
    try {
      const response = await apiService.get(`/api/intern-progress/${internID}`);
      const courseStatus = response.data.course_status;

      const initialMaterials = {};
      fetchedCourses.forEach(course => {
        const materialsStatus = courseStatus[course.id] || {};
        const materialKeys = Object.keys(materialsStatus);
        const lastCompletedIndex = materialKeys.findIndex(key => !materialsStatus[key]) - 1;

        initialMaterials[course.id] = Math.max(0, lastCompletedIndex + 1);
      });

      console.log("initialMaterials:", initialMaterials);
      setCourseStatus(courseStatus);
      setCurrentMaterials(initialMaterials);
    } catch (error) {
      console.error('Error fetching course progress:', error);
    }
  };

  const handleCompleteMaterial = async (courseId, materialId) => {
    console.log(`Completing material: ${materialId} for course: ${courseId}`);
    
    if (materialId === undefined) {
      console.error("Material ID is undefined. Cannot update progress.");
      return;
    }

    const updatedCourseStatus = {
      ...courseStatus,
      [courseId]: {
        ...courseStatus[courseId],
        [materialId]: true,
      },
    };

    setCourseStatus(updatedCourseStatus);

    setCurrentMaterials(prev => {
      const newCount = prev[courseId] + 1;
      console.log(`Updating currentMaterials for course ${courseId}: ${newCount}`);
      return {
        ...prev,
        [courseId]: newCount,
      };
    });

    console.log("Updated course status:", updatedCourseStatus);

    try {
      await apiService.post('/api/update-progress', {
        internID,
        progress: updatedCourseStatus,
      });
      console.log("Progress updated in backend successfully");
    } catch (error) {
      console.error('Error updating progress in the backend:', error);
    }
  };

  const isMaterialUnlocked = (course, materialIndex) => {
    const courseId = course.id;
    const previousMaterialId = course.material[materialIndex - 1]?.materialID;
    return materialIndex === 0 || 
           courseStatus[courseId]?.[previousMaterialId] || 
           materialIndex < currentMaterials[courseId];
  };

  return (
    <Container>
      <Row>
        <Col>
          <Typography variant="h4" sx={{ margin: '20px 0' }}>Your Courses</Typography>
          {courses.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              No courses available for your domain.
            </Typography>
          ) : (
            courses.map((course) => (
              <Card key={course.id} sx={{ marginBottom: '20px', boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ marginBottom: '10px' }}>{course.course_name}</Typography>

                  {course.material.map((file, materialIndex) => {
                    const isCompleted = courseStatus[course.id]?.[file.materialID];
                    const isUnlocked = isMaterialUnlocked(course, materialIndex);

                    console.log(`Material ${file.materialID}: isCompleted=${isCompleted}, isUnlocked=${isUnlocked}`);

                    return (
                      <div key={materialIndex} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        {isUnlocked ? (
                          <>
                            <a
                              href={`http://localhost:5000${file.url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'none', color: '#1976d2', flexGrow: 1 }}
                            >
                              {file.name}
                            </a>
                            {isCompleted && (
                              <CheckCircleIcon sx={{ color: 'green', marginLeft: '10px' }} />
                            )}
                          </>
                        ) : (
                          <Typography variant="body2" color="textSecondary" style={{ flexGrow: 1 }}>
                            <i className="fa fa-lock" aria-hidden="true"></i> {file.name}
                          </Typography>
                        )}

                        {/* Mark as completed button */}
                        {isUnlocked && !isCompleted && (
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleCompleteMaterial(course.id, file.materialID)}
                            sx={{ marginLeft: '10px' }}
                          >
                            Mark as Completed
                          </Button>
                        )}

                        {/* Completed status */}
                        {isCompleted && (
                          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                            <LinearProgress variant="determinate" value={100} sx={{ width: '100px' }} />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Quiz at the end of the course */}
                  {course.material.every((file) => courseStatus[course.id]?.[file.materialID]) && (
                    <div style={{ marginTop: '20px' }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        href={`/quiz/${course.id}`}
                      >
                        Take Course Quiz
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default LMS_dash;
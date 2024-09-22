// import React, { useState, useEffect } from 'react';
// import {
//   TextField, Button, Card, CardContent, Typography,
//   IconButton, CardActions, Dialog, DialogTitle,
//   DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl,
//   Checkbox, ListItemText
// } from '@mui/material';

// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import apiService from '../../../apiService';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const HrLMSDash = () => {
//   const [courses, setCourses] = useState([]);
//   const [courseName, setCourseName] = useState('');
//   const [selectedDomains, setSelectedDomains] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [editingFile, setEditingFile] = useState(null);

//   const domains = [
//     "Full Stack Python", "Full Stack Java", "Mern Full Stack",
//     "Testing Tools", "Scrum Master", "Businesses Analyst",
//     "Data Science", "Cyber Security"
//   ];

//   useEffect(() => {
//     fetchCourses();
//     fetchCourseMaterials();
//   }, []);

//   const fetchCourses = async () => {
//     try {
//       const response = await apiService.get('/api/courses');
//       if (response.status === 200) {
//         console.log(response.data);
//         setCourses(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       toast.error('Failed to fetch courses. Please try again.');
//     }
//   };

//   const handleCreateCourse = async () => {
//     if (!courseName) {
//       toast.warn('Please provide a course name.');
//       return;
//     }

//     if (selectedDomains.length === 0) {
//       toast.warn('Please select at least one domain.');
//       return;
//     }

//     if (courses.some(course => course.course_name === courseName)) {
//       toast.error('Course name already exists.');
//       return;
//     }

//     try {
//       const response = await apiService.post('/api/create_course', {
//         course_name: courseName,
//         domains: selectedDomains // Include the selected domains in the request
//       });
//       if (response.status === 201) {
//         fetchCourses();
//         setCourseName('');
//         setSelectedDomains([]); // Reset selected domains
//         toast.success('Course created successfully.');
//       }
//     } catch (error) {
//       console.error('Error creating course:', error);
//       toast.error('Failed to create course. Please try again.');
//     }
//   };


//   const handleFileUpload = async (event, course) => {
//     const formData = new FormData();
//     const selectedFiles = Array.from(event.target.files);

//     selectedFiles.forEach((file) => {
//       formData.append('files', file);
//     });

//     try {
//       const response = await apiService.post(`/api/upload_files/${course.course_name}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.status === 200) {
//         toast.success('Files uploaded successfully.');
//       }
//     } catch (error) {
//       console.error('File upload failed:', error);
//       toast.error('File upload failed. Please try again.');
//     }
//   };

//   const fetchCourseMaterials = async (courseName) => {
//     try {
//       const response = await apiService.get(`/api/course_data/${courseName}`);
//       if (response.status === 200) {
//         const courseData = response.data[0];
//         console.log(courseData);
//       }
//     } catch (error) {
//       console.error('Error fetching course materials:', error);
//     }
//   };

//   const handleDeleteFile = async (course, fileName) => {
//     try {
//       const response = await apiService.post(`/api/courses/${course.course_name}/remove_file`, { fileName });
//       if (response.status === 200) {
//         fetchCourseMaterials(course.course_name);
//       }
//     } catch (error) {
//       console.error('Error deleting file:', error);
//       alert('Failed to delete file. Please try again.');
//     }
//   };

//   const handleEditFile = (file) => {
//     setEditingFile(file);
//     setOpenDialog(true);
//   };

//   const handleSaveEdit = async () => {
//     try {
//       const response = await apiService.post(`/api/courses/${selectedCourse.course_name}/update_files`, {
//         files: [editingFile],
//         deleteFiles: []
//       });
//       if (response.status === 200) {
//         setOpenDialog(false);
//         fetchCourseMaterials(selectedCourse.course_name);
//       }
//     } catch (error) {
//       console.error('Error updating file:', error);
//       alert('Failed to update file. Please try again.');
//     }
//   };

//   const verifyMaterial = (file) => {
//     if (!file || !file.url) {
//       alert("Unable to open file. File information is incomplete.");
//       return;
//     }

//     let fileUrl = file.url;
//     if (!fileUrl.startsWith('http')) {
//       fileUrl = `http://localhost:5000${fileUrl}`;
//     }

//     window.open(fileUrl, '_blank', 'noopener,noreferrer');
//   };

//   return (
//     <div style={{ overflow: 'auto' }}>
//       <Typography variant="h4" style={{ marginBottom: '20px' }}>Course Management</Typography>

//       <div style={{ display: 'flex', marginBottom: '20px' }}>
//         <TextField
//           label="Course Name"
//           variant="outlined"
//           value={courseName}
//           onChange={(e) => setCourseName(e.target.value)}
//           style={{ marginRight: '10px' }}
//         />
//         <FormControl style={{ marginRight: '10px', minWidth: 120 }}>
//           <InputLabel>Domains</InputLabel>
//           <Select
//             multiple
//             value={selectedDomains}
//             onChange={(e) => setSelectedDomains(e.target.value)}
//             renderValue={(selected) => selected.join(', ')}
//           >
//             {domains.map((domain) => (
//               <MenuItem key={domain} value={domain}>
//                 <Checkbox checked={selectedDomains.indexOf(domain) > -1} />
//                 <ListItemText primary={domain} />
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleCreateCourse}
//           startIcon={<AddIcon />}
//         >
//           Add Course
//         </Button>
//       </div>

//       <div style={{ display: 'flex', flexWrap: 'wrap' }}>
//         {courses.map((course, index) => (
//           <Card key={index} style={{ width: '300px', margin: '10px' }}>
//             <CardContent>
//               <Typography variant="h5">{course.course_name}</Typography>
//               <Typography variant="body2">{`${course.material ? course.material.length : 0} files`}</Typography>
//             </CardContent>
//             <CardActions>
//               <Button size="small" onClick={() => {
//                 setSelectedCourse(course);
//                 fetchCourseMaterials(course.course_name);
//               }}>View Files</Button>
//             </CardActions>
//           </Card>
//         ))}
//       </div>

//       <Dialog open={selectedCourse !== null} onClose={() => setSelectedCourse(null)} fullWidth maxWidth="md">
//         {selectedCourse && (
//           <>
//             <DialogTitle>{selectedCourse.course_name}</DialogTitle>
//             <DialogContent>
//               {selectedCourse && selectedCourse.material && selectedCourse.material.map((file, index) => (
//                 <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
//                   <Typography variant="body1" style={{ flexGrow: 1 }}>
//                     {`${index + 1}. ${file.name}`}
//                   </Typography>
//                   <Button onClick={() => verifyMaterial(file.url)}>Verify</Button>
//                   <IconButton onClick={() => handleEditFile(file)}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDeleteFile(selectedCourse, file.name)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </div>
//               ))}
//             </DialogContent>
//             <DialogActions>
//               <Button
//                 variant="contained"
//                 component="label"
//                 startIcon={<CloudUploadIcon />}
//               >
//                 Upload Material
//                 <input
//                   type="file"
//                   hidden
//                   multiple
//                   onChange={(event) => handleFileUpload(event, selectedCourse)}
//                 />
//               </Button>
//               <Button onClick={() => setSelectedCourse(null)}>Close</Button>
//             </DialogActions>
//           </>
//         )}
//       </Dialog>

//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Edit File</DialogTitle>
//         <DialogContent>
//           <TextField
//             label="File Name"
//             fullWidth
//             value={editingFile?.name || ''}
//             onChange={(e) => setEditingFile({ ...editingFile, name: e.target.value })}
//             style={{ marginBottom: '20px' }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleSaveEdit} color="primary">Save</Button>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//         </DialogActions>
//       </Dialog>

//       <ToastContainer />
//     </div>
//   );
// };

// export default HrLMSDash;


import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Card, CardContent, Typography,
  IconButton, CardActions, Dialog, DialogTitle,
  DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl,
  Checkbox, ListItemText
} from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import apiService from '../../../apiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HrLMSDash = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);

  const domains = [
    "Full Stack Python", "Full Stack Java", "Mern Full Stack",
    "Testing Tools", "Scrum Master", "Businesses Analyst",
    "Data Science", "Cyber Security"
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await apiService.get('/api/courses');
      if (response.status === 200) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses. Please try again.');
    }
  };

  const handleCreateCourse = async () => {
    if (!courseName) {
      toast.warn('Please provide a course name.');
      return;
    }

    if (selectedDomains.length === 0) {
      toast.warn('Please select at least one domain.');
      return;
    }

    if (courses.some(course => course.course_name === courseName)) {
      toast.error('Course name already exists.');
      return;
    }

    try {
      const response = await apiService.post('/api/create_course', {
        course_name: courseName,
        domains: selectedDomains
      });
      if (response.status === 201) {
        fetchCourses();
        setCourseName('');
        setSelectedDomains([]);
        toast.success('Course created successfully.');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    }
  };

  const handleFileUpload = async (event, course) => {
    const formData = new FormData();
    const selectedFiles = Array.from(event.target.files);
  
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
  
    try {
      const response = await apiService.post(`/api/upload_files/${course.course_name}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        toast.success('Files uploaded successfully.');
        // Update the material list without refetching
        // const updatedMaterial = [...selectedCourse.material, ...response.data.material];
        // setSelectedCourse({ ...selectedCourse, material: updatedMaterial });
      }
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('File upload failed. Please try again.');
    }
  };
  

  const handleDeleteFile = async (course, fileName) => {
    try {
      const response = await apiService.post(`/api/courses/${course.course_name}/remove_file`, { fileName });
      if (response.status === 200) {
        // Remove the deleted file from state directly
        const updatedMaterial = selectedCourse.material.filter(file => file.name !== fileName);
        setSelectedCourse({ ...selectedCourse, material: updatedMaterial });
        toast.success('File deleted successfully.');
      }
    } catch (error) {
      console.log("Error :", error);
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file. Please try again.');
    }
  };

  const handleEditFile = (file) => {
    setEditingFile(file);
    setOpenDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await apiService.post(`/api/courses/${selectedCourse.course_name}/update_files`, {
        files: [editingFile], // Array of files to add/update
        deleteFiles: [] // No deletions during edit
      });
      if (response.status === 200) {
        setOpenDialog(false);
        // Update the material directly
        const updatedMaterial = selectedCourse.material.map(file => file.materialID === editingFile.materialID ? editingFile : file);
        setSelectedCourse({ ...selectedCourse, material: updatedMaterial });
        toast.success('File updated successfully.');
      }
    } catch (error) {
      console.error('Error updating file:', error);
      toast.error('Failed to update file. Please try again.');
    }
  };

  // const verifyMaterial = (file) => {
  //   if (!file || !file.url) {
  //     alert("Unable to open file. File information is incomplete.");
  //     return;
  //   }

  //   let fileUrl = file.url;
  //   if (!fileUrl.startsWith('http')) {
  //     fileUrl = `http://localhost:5000${fileUrl}`;
  //   }

  //   window.open(fileUrl, '_blank', 'noopener,noreferrer');
  // };

  return (
    <div style={{ overflow: 'auto' }}>
      <Typography variant="h4" style={{ marginBottom: '20px' }}>Course Management</Typography>

      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <TextField
          label="Course Name"
          variant="outlined"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <FormControl style={{ marginRight: '10px', minWidth: 120 }}>
          <InputLabel>Domains</InputLabel>
          <Select
            multiple
            value={selectedDomains}
            onChange={(e) => setSelectedDomains(e.target.value)}
            renderValue={(selected) => selected.join(', ')}
          >
            {domains.map((domain) => (
              <MenuItem key={domain} value={domain}>
                <Checkbox checked={selectedDomains.indexOf(domain) > -1} />
                <ListItemText primary={domain} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateCourse}
          startIcon={<AddIcon />}
        >
          Add Course
        </Button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {courses.map((course, index) => (
          <Card key={index} style={{ width: '300px', margin: '10px' }}>
            <CardContent>
              <Typography variant="h5">{course.course_name}</Typography>
              <Typography variant="body2">{`${course.material ? course.material.length : 0} files`}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => setSelectedCourse(course)}>
                View Files
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>

      {selectedCourse && (
        <Dialog open={selectedCourse !== null} onClose={() => setSelectedCourse(null)} fullWidth maxWidth="md">
          <DialogTitle>{selectedCourse.course_name}</DialogTitle>
          <DialogContent>
            {selectedCourse.material && selectedCourse.material.map((file, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Typography variant="body1" style={{ flexGrow: 1 }}>
                  {`${index + 1}. `}
                  <a
                    href={`http://localhost:5000${file.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: '#1976d2', flexGrow: 1 }}
                  >
                    {file.name}
                  </a>
                </Typography>
                {/* <IconButton onClick={() => handleEditFile(file)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteFile(selectedCourse, file.name)}>
                  <DeleteIcon />
                </IconButton> */}
              </div>
            ))}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload Material
              <input
                type="file"
                hidden
                multiple
                onChange={(event) => handleFileUpload(event, selectedCourse)}
              />
            </Button>
            <Button onClick={() => setSelectedCourse(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit File</DialogTitle>
        <DialogContent>
          <TextField
            label="File Name"
            fullWidth
            value={editingFile?.name || ''}
            onChange={(e) => setEditingFile({ ...editingFile, name: e.target.value })}
            style={{ marginBottom: '20px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveEdit} color="primary">Save</Button>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </div>
  );
};

export default HrLMSDash;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseService } from '../../services/apiService';

const initialState = {
  courses: [],
  enrolledCourses: [],
  currentCourse: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await courseService.getAllCourses(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await courseService.getCourseById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
    }
  }
);

export const createCourse = createAsyncThunk(
  'courses/createCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await courseService.createCourse(courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create course');
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, courseData }, { rejectWithValue }) => {
    try {
      const response = await courseService.updateCourse(id, courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update course');
    }
  }
);

export const enrollCourse = createAsyncThunk(
  'courses/enrollCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await courseService.enrollCourse(courseId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to enroll');
    }
  }
);

export const fetchEnrolledCourses = createAsyncThunk(
  'courses/fetchEnrolledCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await courseService.getEnrolledCourses();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enrolled courses');
    }
  }
);
export const fetchTeacherCourses = createAsyncThunk(
  'courses/fetchTeacherCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await courseService.getTeacherCourses();
      return response.data.courses;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teacher courses');
    }
  }
);
const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Course By ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.course;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Course
      .addCase(createCourse.fulfilled, (state, action) => {
        state.courses.unshift(action.payload.course);
      })
      // Update Course
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex(c => c._id === action.payload.course._id);
        if (index !== -1) {
          state.courses[index] = action.payload.course;
        }
        state.currentCourse = action.payload.course;
      })
      // Enroll Course
      .addCase(enrollCourse.fulfilled, (state, action) => {
        state.enrolledCourses.push(action.payload.course);
      })
      // Fetch Enrolled Courses
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.enrolledCourses = action.payload.courses;
      });
  },
});

export const { clearCurrentCourse, clearError } = courseSlice.actions;
export default courseSlice.reducer;

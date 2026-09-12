import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { normalizeNrReports } from "../utils/nrReports";

export const nrreport = createAsyncThunk(
  "reports/nrreport",
  async ({ param1, param2 }, { rejectWithValue, signal }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/reports/nr`,
        {
          signal,
          params: {
            param1,
            param2,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return normalizeNrReports(response.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch NR report"
      );
    }
  }
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    nrReport: [],
    nrReportLoading: false,
    nrReportError: null,
    nrReportRequestId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(nrreport.pending, (state, action) => {
        state.nrReportRequestId = action.meta.requestId;
        state.nrReportLoading = true;
        state.nrReportError = null;
      })
      .addCase(nrreport.fulfilled, (state, action) => {
        if (state.nrReportRequestId !== action.meta.requestId) return;
        state.nrReportRequestId = null;
        state.nrReportLoading = false;
        state.nrReport = action.payload;
      })
      .addCase(nrreport.rejected, (state, action) => {
        if (state.nrReportRequestId !== action.meta.requestId) return;
        state.nrReportRequestId = null;
        state.nrReportLoading = false;
        state.nrReportError = action.meta.aborted ? null : action.payload || "Failed to fetch NR report";
      });
  },
});

export default reportsSlice.reducer;

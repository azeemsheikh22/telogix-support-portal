import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  normalizeDataDelayReports,
  normalizeIgnitionIssuesReports,
  normalizeNrReports,
} from "../utils/nrReports";

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

export const dataDelayReport = createAsyncThunk(
  "reports/dataDelayReport",
  async ({ groupId, movingSeconds, stopSeconds }, { rejectWithValue, signal }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/reports/data-delay`,
        {
          signal,
          params: { groupId, movingSeconds, stopSeconds },
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return normalizeDataDelayReports(response.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch data delay report",
      );
    }
  },
);

export const ignitionIssuesReport = createAsyncThunk(
  "reports/ignitionIssuesReport",
  async ({ groupId, distanceKm }, { rejectWithValue, signal }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/reports/ignition-issues`,
        {
          signal,
          params: { groupId, distanceKm },
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return normalizeIgnitionIssuesReports(response.data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch ignition issues report",
      );
    }
  },
);

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    nrReport: [],
    nrReportLoading: false,
    nrReportError: null,
    nrReportRequestId: null,
    dataDelayReport: [],
    dataDelayReportLoading: false,
    dataDelayReportError: null,
    dataDelayReportRequestId: null,
    ignitionIssuesReport: [],
    ignitionIssuesReportLoading: false,
    ignitionIssuesReportError: null,
    ignitionIssuesReportRequestId: null,
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
      })
      .addCase(dataDelayReport.pending, (state, action) => {
        state.dataDelayReportRequestId = action.meta.requestId;
        state.dataDelayReportLoading = true;
        state.dataDelayReportError = null;
      })
      .addCase(dataDelayReport.fulfilled, (state, action) => {
        if (state.dataDelayReportRequestId !== action.meta.requestId) return;
        state.dataDelayReportRequestId = null;
        state.dataDelayReportLoading = false;
        state.dataDelayReport = action.payload;
      })
      .addCase(dataDelayReport.rejected, (state, action) => {
        if (state.dataDelayReportRequestId !== action.meta.requestId) return;
        state.dataDelayReportRequestId = null;
        state.dataDelayReportLoading = false;
        state.dataDelayReportError = action.meta.aborted
          ? null
          : action.payload || "Failed to fetch data delay report";
      })
      .addCase(ignitionIssuesReport.pending, (state, action) => {
        state.ignitionIssuesReportRequestId = action.meta.requestId;
        state.ignitionIssuesReportLoading = true;
        state.ignitionIssuesReportError = null;
      })
      .addCase(ignitionIssuesReport.fulfilled, (state, action) => {
        if (state.ignitionIssuesReportRequestId !== action.meta.requestId) return;
        state.ignitionIssuesReportRequestId = null;
        state.ignitionIssuesReportLoading = false;
        state.ignitionIssuesReport = action.payload;
      })
      .addCase(ignitionIssuesReport.rejected, (state, action) => {
        if (state.ignitionIssuesReportRequestId !== action.meta.requestId) return;
        state.ignitionIssuesReportRequestId = null;
        state.ignitionIssuesReportLoading = false;
        state.ignitionIssuesReportError = action.meta.aborted
          ? null
          : action.payload || "Failed to fetch ignition issues report";
      });
  },
});

export default reportsSlice.reducer;

// Todo
// Logic of RQC Columns

import 'date-fns';
import React from 'react';
import { connect } from 'react-redux';

import MUIDataTable from "mui-datatables";
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import axios from 'axios';
import Box from '@material-ui/core/Box';

import { theme } from '../theme/theme';

import { changeFetching } from '../store/actions/auth';
import { allStages, feedbackableStagesData } from '../config';
import GlobalService from '../services/GlobalService';
import StudentService from '../services/StudentService';


// API USage : https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/
const baseURL = process.env.API_URL;

const styles = theme => ({
  clear: {
    clear: 'both'
  }
})

export class FeedbackbleStageWiseDangling extends React.Component {

  constructor(props) {

    super(props);
    this.stageWiseDanglingReportURL = baseURL + 'students/report/dangling';
    
    this.state = {
      data: [],
    }
  }

  dataConvert = (data) => {
    const newData = [];
    for (const [key, value] of Object.entries(data)) {
      const dic = {};
      if (feedbackableStagesData[key]) {
        dic.female = value[1];
        dic.male = value[2];
        dic.transgender = value[3];
        dic.unspecified = value[null];
        dic.total = dic.female + dic.male + dic.transgender + dic.unspecified;
        dic.stage = allStages[key];
        newData.push(dic);
      }
    } 
    this.setState({
      data: newData,
    });
  }

  render = () => {

    return <Box>
      <MuiThemeProvider theme={theme}>
        <MUIDataTable
          columns={StudentService.columnDanglingReports}
          data={this.state.data}
          icons={GlobalService.tableIcons}
          options={{
            headerStyle: {
              color: theme.palette.primary.main
            },
            exportButton: true,
            pageSize: 100,
            showTitle: false,
            selectableRows: 'none',
            toolbar: false,
            filtering: true,
            filter: true,
            filterType: 'dropdown',
            responsive: 'scrollFullHeight',
          }}
        />
      </MuiThemeProvider>
    </Box>
  }

  componentDidMount() {
    this.fetchonwerReport();
  }

  async fetchonwerReport() {
    try {
      this.props.fetchingStart()
      const response = await axios.get(this.stageWiseDanglingReportURL, { });
      this.dataConvert(response.data.data);
      this.props.fetchingFinish();
    } catch (e) {
      console.log(e)
      this.props.fetchingFinish()
    }
  };
};

const mapStateToProps = (state) => ({
  loggedInUser: state.auth.loggedInUser
  // "kya fark padta hai": ''
});

const mapDispatchToProps = (dispatch) => ({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false))
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FeedbackbleStageWiseDangling));

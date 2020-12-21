import React, { Component } from 'react';
import MysqlLayer from 'utils/MysqlLayer';
import ErrorReporting from 'utils/ErrorReporting';
import Contacts from './Contacts';
import { ToastContainer } from 'react-toastify';
import Toasts from 'utils/Toasts';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import DateTime from 'react-datetime';
import _ from 'lodash';
import NumberFormat from 'react-number-format';
import './datetime.css';

class Collection extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      accountStatus: null,
      caseNotes: null,
      changesMade: false,
      cipcStatus: null,
      clientId: sessionStorage.getItem('cwsClient'),
      collection: null,
      contactPerson: null,
      contactRecords: null,
      currentAssignment: sessionStorage.getItem('cwsUser'),
      debitResubmissionAmount: null,
      debitResubmissionDate: null,
      disabled: false,
      emailUsed: null,
      kamNotes: null,
      nextVisitDateTime: null,
      nextSteps: null,
      numberCalled: null,
      outcomeResolution: null,
      outcomeNotes: null,
      outcomeRecords: null,
      pendReason: '---',
      prevStatus: 'Open',
      ptpAmount: null,
      ptpDate: null,
      recordId: null,
      resolution: '---',
      role: sessionStorage.getItem('cwsRole'),
      transactionType: null,
      type: null,
      user: sessionStorage.getItem('cwsUser'),
      users: [],
      workspace: null,
    }

    this.errorReporting = new ErrorReporting();
    this.mysqlLayer = new MysqlLayer();
    this.handleChange = this.handleChange.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handlePTPDate = this.handlePTPDate.bind(this);
    this.handleDebitDate = this.handleDebitDate.bind(this);
    //this.pendRecord = this.pendRecord.bind(this);
    //this.closeRecord = this.closeRecord.bind(this);
    //this.updateRecord = this.updateRecord.bind(this);
    this.processRecord = this.processRecord.bind(this);

  }

  async componentDidMount() {
    //console.log('Collection props: ', this.props);
    this._isMounted = true;
    let type = '';
    let workspace = '';
    let recordId = '';
    const clientId = this.state.clientId;

    if (this.props.location.state === undefined) {
      //console.log('Collection props: ', this.props.match);
      if (this.props.match.path === '/workzone/collections/collection/:id') {
        type = 'business';
        workspace = 'collections';
        recordId = this.props.match.params.id;
      }
    } else if (this.props.location.state !== undefined) {
      type = this.props.location.state.type;
      workspace = this.props.location.state.workspace;
      recordId = this.props.location.state.caseId;
    }

    //let record = [];
    //console.log('Collection this.props.location.state.record: ', this.props.location.state.record);
    //console.log('this.props.location.state !== undefined: ', this.props.location.state === undefined);
    // check if there are any props or send to the dashboard again


    let record = null;
    await this.mysqlLayer.Get(`/${type}/${workspace}/read_item/${clientId}/${recordId}`)
      .then(response => {
        console.log('Collection response: ', response);
        if (response) record = response[0];
      }

    );

    this.setState({
      record: record,
      recordId: recordId,
      type: type,
      workspace: workspace
    });

    // Check if there are any associated outcomes to load
    let outcomeRecords = null;
    await this.mysqlLayer.Get(`/${type}/${workspace}/read_outcomes/${clientId}/${recordId}`)
      .then(outcomeResponse => {
        //console.log('Outcome records response: ', outcomeResponse);
        if (outcomeResponse) outcomeRecords = outcomeResponse;
      }
    );

    // Check if there are any extra contact details to load
    let contactRecords = null;
    await this.mysqlLayer.Get(`/${type}/${workspace}/read_contacts/${clientId}/${recordId}`)
      .then(contactResponse => {
        //console.log('contactRecords records response: ', contactResponse);
        if (contactResponse) contactRecords = contactResponse;
      }
    );

    // Getting all the config for dropdown lists, etc
    let resolutions = await this.mysqlLayer.Get(`/admin/resolutions/list_all`);
    let pends = await this.mysqlLayer.Get(`/admin/pendreasons/list_all`);
    let transactionTypes = await this.mysqlLayer.Get(`/admin/transactiontypes/list_all`);
    let accountStatuses = await this.mysqlLayer.Get(`/admin/accountstatuses/list_all`);
    let cipcStatuses = await this.mysqlLayer.Get(`/admin/cipcstatuses/list_all`);
    let idvStatuses = await this.mysqlLayer.Get(`/admin/idvstatuses/list_all`);
    let users = await this.mysqlLayer.Get(`/admin/users/${clientId}`);

    // saving the previous status so we can unlock it properly after releasing the record
    console.log('currentStatus: ', record);
    const prevStatus = record.currentStatus !== undefined ? record.currentStatus : 'Open';

    this.setState({
      accountStatuses: accountStatuses,
      accountStatus: record.accountStatus,
      caseNotes: record.caseNotes,
      cipcStatuses: cipcStatuses,
      idvStatuses: idvStatuses,
      regIdStatus: record.regIdStatus,
      contactRecords: contactRecords,
      collection: record,
      outcomeRecords: outcomeRecords,
      pendReasons: pends,
      prevStatus: prevStatus,
      resolutions: resolutions,
      transactionTypes: transactionTypes,
      users: users
    });

    // lock the record so no other agent accidentally opens it
    const dateTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const update = {
      currentStatus: 'Locked',
      lockedDatetime: dateTime
    };
    //console.log('collection: ', this.state.collection);
    await this.mysqlLayer.Put(`/${type}/cases/update_item/${clientId}/${recordId}`, update);
  }


  componentWillUnmount() {
    this._isMounted = false;
  }

  handleDate(e){
    if (typeof e !== 'string') {
      const nextVisitDateTime = moment(e.toDate()).format("YYYY-MM-DD HH:mm:ss");
      //console.log('nextVisitDateTime: ', nextVisitDateTime);
      this.setState({ nextVisitDateTime: nextVisitDateTime });
    }
  };

  handlePTPDate(e){
    if (typeof e !== 'string') {
      const ptpDate = moment(e.toDate()).format("YYYY-MM-DD HH:mm:ss");
      //console.log('ptpDate: ', ptpDate);
      this.setState({ ptpDate: ptpDate });
    }
  };

  handleDebitDate(e){
    if (typeof e !== 'string') {
      const debitResubmissionDate = moment(e.toDate()).format("YYYY-MM-DD HH:mm:ss");
      //console.log('debitResubmissionDate: ', debitResubmissionDate);
      this.setState({ debitResubmissionDate: debitResubmissionDate });
    }
  };

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      changesMade: true
    });
    //console.log('this.state after change: ', this.state);
  }

  async cancel() {
    let timer = 0;
    if (this.state.changesMade) {
      Toasts('warn', 'All changes have been lost', false);
      timer = 3000;
    }

    let prevStatus = this.state.prevStatus;

    // if prevStatus === 'Locked', change to 'Open'
    if (prevStatus === 'Locked') prevStatus = 'Open';

    // unlock the record and release it to the pool
    const update = {
      currentStatus: prevStatus
    };
    await this.mysqlLayer.Put(`/${this.state.type}/cases/update_item/${this.state.clientId}/${this.state.collection.caseId}`, update);

    setTimeout(() => this.props.history.push({
      pathname: '/workzone/collections',
      state: {
        recordStatus: prevStatus,
        clientId: this.state.clientId,
        type: this.state.type,
        workspace: this.state.workspace
      }
    }), timer);
  }

  checkFields(process, fields) {
    let stateConsts = [];
    for (const [key, value] of Object.entries(this.state)) {
      stateConsts.push({[key]: value});
    }

    // loop through fields to check if they're populated
    let problems = [];
    fields.forEach(field => {
      stateConsts.forEach(stateConst => {
        let stateField = Object.keys(stateConst).toString();
        let stateValue = Object.values(stateConst).toString();
        if (stateField === field) {
          if (stateValue === '') problems.push(`Please enter a value for ${_.startCase(stateField)}`);
        }
      });
    });

    // check if relevant linked fields are populated
    if (this.state.emailUsed === null && this.state.transactionType === 'Email') problems.push('Please provide an email address');
    if (this.state.role !== 'kam' && (!this.state.outcomeNotes || this.state.outcomeNotes.length < 10)) problems.push('Please enter a note longer than 10 characters');
    if (this.state.role === 'kam' && (!this.state.kamNotes || this.state.kamNotes.length < 10)) problems.push('Please enter a KAM note longer than 10 characters');
    if (this.state.numberCalled === null && this.state.transactionType === 'Call') problems.push('Please provide a telephone number');
    if (this.state.numberCalled !== null && this.state.numberCalled.length > 11) problems.push('The telephone number can only be up to 11 digits long');
    if (process === 'Pended' && this.state.pendReason === '---') problems.push('Please select a pend reason');
    if (this.state.ptpDate && !this.state.ptpAmount) problems.push('Please provide a PTP amount');
    if (!this.state.ptpDate && this.state.ptpAmount) problems.push('Please provide a PTP date');
    if (this.state.debitResubmissionDate && !this.state.debitResubmissionAmount) problems.push('Please provide a debit resubmission amount');
    if (!this.state.debitResubmissionDate && this.state.debitResubmissionAmount) problems.push('Please provide a debit resubmission date');

    return problems;
  }

  async processRecord(process) {
    let {
      clientId,
      contactPerson,
      currentAssignment,
      debitResubmissionAmount,
      debitResubmissionDate,
      emailUsed,
      nextSteps,
      nextVisitDateTime,
      numberCalled,
      outcomeResolution,
      outcomeNotes,
      kamNotes,
      pendReason,
      ptpDate,
      ptpAmount,
      role,
      type,
      transactionType,
      user,
      workspace
    } = this.state;

    // Mandatory fields array
    const mandatoryFields = [
      {
        action: 'Closed',
        fields: [
          'outcomeResolution'
        ]
      },
      {
        action: 'Pended',
        fields: [
          'contactPerson',
          'currentAssignment',
          'nextSteps',
          'nextVisitDateTime',
          'outcomeResolution',
          'pendReason',
          'transactionType'
        ]
      },
      {
        action: 'Updated',
        fields: [
          'currentAssignment',
          'nextVisitDateTime',
          'outcomeResolution'
        ]
      }
    ];

    // checking all mandatory fields are populated for the respective process
    let fields = null;
    switch (process) {
      case 'Closed':
        mandatoryFields.forEach(field => {
          if (process === field.action) fields = field.fields;
        });

        break;
      case 'Pended':
        mandatoryFields.forEach(field => {
          if (process === field.action) fields = field.fields;
        });

        break;
      case 'Updated':
        mandatoryFields.forEach(field => {
          if (process === field.action) fields = field.fields;
        });
        process = 'Open';

        break;
      default:
        console.log('Problem with process from button');
    }

    let problems = this.checkFields(process, fields);
    if (problems.length === 0) {
      this.setState({ disabled: true });

      // Only update the relevant notes
      //let newNote = '';
      let newkamNote = '';
      if (role === 'kam') {
        let oldkamNotes = kamNotes ? kamNotes : '';
        newkamNote = `${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')} by ${user}\n${kamNotes}\n\r`  + oldkamNotes;

        if (!outcomeNotes) outcomeNotes = 'KAM notes updated'; //this.setState({ outcomeNotes: 'KAM notes updated' });
      } /*else {
        let oldNotes = outcomeNotes ? outcomeNotes + `\n\r` : '';
        newNote = oldNotes + outcomeNotes;
      }*/

      let closedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      let closedBy = user;

      let customerUpdate = {
        regIdStatus: this.state.regIdStatus,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      };

      let caseUpdate = null;

      if (process === 'Pended') {
        caseUpdate = {
          currentAssignment: currentAssignment,
          currentStatus: process,
          kamNotes: newkamNote,
          nextVisitDateTime: nextVisitDateTime,
          pendReason: pendReason,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };
      } else if (process === 'Closed') {
        caseUpdate = {
          currentStatus: process,
          kamNotes: newkamNote,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };
      } else {
        caseUpdate = {
          currentAssignment: currentAssignment,
          currentStatus: process,
          kamNotes: newkamNote,
          nextVisitDateTime: nextVisitDateTime,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };
      }

      let outcomeInsert = null;
      let accountUpdate = null;
      if (!ptpDate && !debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcomeResolution: outcomeResolution,
          outcomeNotes: outcomeNotes,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          f_caseId: this.state.collection.caseId
        };
      } else if (ptpDate && !debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          lastPTPDate: moment(ptpDate).format('YYYY-MM-DD'),
          lastPTPAmount: ptpAmount,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcomeResolution: outcomeResolution,
          outcomeNotes: outcomeNotes,
          ptpDate: moment(ptpDate).format('YYYY-MM-DD'),
          ptpAmount: ptpAmount,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          f_caseId: this.state.collection.caseId
        };
      } else if (!ptpDate && debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcomeResolution: outcomeResolution,
          outcomeNotes: outcomeNotes,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          debitResubmissionDate: moment(debitResubmissionDate).format('YYYY-MM-DD'),
          debitResubmissionAmount: debitResubmissionAmount,
          f_caseId: this.state.collection.caseId
        };
      } else if (ptpDate && debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          lastPTPDate: moment(ptpDate).format('YYYY-MM-DD'),
          lastPTPAmount: ptpAmount,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcomeResolution: outcomeResolution,
          outcomeNotes: outcomeNotes,
          ptpDate: moment(ptpDate).format('YYYY-MM-DD'),
          ptpAmount: ptpAmount,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          debitResubmissionDate: moment(debitResubmissionDate).format('YYYY-MM-DD'),
          debitResubmissionAmount: debitResubmissionAmount,
          f_caseId: this.state.collection.caseId
        };
      }

      await this.mysqlLayer.Put(`/${type}/customers/update_item/${clientId}/${this.state.collection.customerRefNo}`, customerUpdate);
      await this.mysqlLayer.Put(`/${type}/accounts/update_item/${clientId}/${this.state.collection.accountNumber}`, accountUpdate);
      await this.mysqlLayer.Put(`/${type}/cases/update_item/${clientId}/${this.state.collection.caseId}`, caseUpdate);

      let resp = await this.mysqlLayer.Post(`/${type}/outcomes/create_item/${clientId}`, outcomeInsert);
      console.log('outcomeInsert: ', outcomeInsert);
      console.log('resp: ', resp);
      this.props.history.push({
        pathname: '/workzone/collections',
        state: {
          recordStatus: process,
          clientId: clientId,
          type: type,
          workspace: workspace
        }
      });
    } else {
      this._isMounted && problems.forEach(problem => Toasts('error', problem, true));
    }

  }

  /*async pendRecord() {
    const {
      contactPerson,
      debitResubmissionAmount,
      debitResubmissionDate,
      emailUsed,
      nextSteps,
      nextVisitDateTime,
      numberCalled,
      outcome,
      outcomeNotes,
      kamNotes,
      notes,
      pendReason,
      ptpDate,
      ptpAmount,
      role,
      transactionType,
      user
    } = this.state;

    // checking all the mandatory fields are populated
    let problems = [];
    if (contactPerson === null) problems.push('Please enter a contact person');
    if (emailUsed === null && transactionType === 'Email') problems.push('Please provide an email address');
    if (role !== 'kam' && (!notes || notes.length < 10)) problems.push('Please enter a note longer than 10 characters');
    if (role === 'kam' && (!kamnotes || kamNotes.length < 10)) problems.push('Please enter a KAM note longer than 10 characters');
    if (nextSteps === null) problems.push('Please provide the next steps');
    if (nextVisitDateTime === null) problems.push('Please provide a next visit date and time');
    if (numberCalled === null && transactionType === 'Call') problems.push('Please provide a telephone number');
    if (numberCalled !== null && numberCalled.length > 11) problems.push('The telephone number can only be up to 11 digits long');
    if (!outcome) problems.push('Please select an outcome resolution');
    if (pendReason === '---') problems.push('Please select a pend reason');
    if (ptpDate && !ptpAmount) problems.push('Please provide a PTP amount');
    if (!ptpDate && ptpAmount) problems.push('Please provide a PTP date');
    if (debitResubmissionDate && !debitResubmissionAmount) problems.push('Please provide a debit resubmission amount');
    if (!debitResubmissionDate && debitResubmissionAmount) problems.push('Please provide a debit resubmission date');
    if (transactionType === null) problems.push('Please enter a transaction type');

    if (problems.length === 0) {//if (notes && notes.length > 10 && nextVisitDateTime !== null && pendReason !== '---') {
      this.setState({ disabled: true });

      // Only update the relevant notes
      if (role === 'kam') {
        let oldkamNotes = kamNotes ? kamNotes + `\n\r` : '';
        let newkamNote = oldkamNotes + `${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')} by ${user}\nNote ${kamNotes}`;
      } else {
        let oldNotes = outcomeNotes ? outcomeNotes + `\n\r` : '';
        let newNote = oldNotes + outcomeNotes;
      }

      let closedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      let closedBy = user;

      let customerUpdate = {
        cipcStatus: this.state.cipcStatus,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      };

      let caseUpdate = {
        currentStatus: 'Pended',
        nextVisitDateTime: nextVisitDateTime,
        kamNotes: newkamNote,
        pendReason: pendReason,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      };

      let outcomeInsert = '';
      let accountUpdate = '';
      if (!ptpDate && !debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcome: outcome,
          outcomeNotes: newNote,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          f_caseId: this.state.collection.caseId
        };
      } else if (ptpDate && !debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          lastPTPDate: moment(ptpDate).format('YYYY-MM-DD'),
          lastPTPAmount: ptpAmount,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcome: outcome,
          outcomeNotes: newNote,
          ptpDate: moment(ptpDate).format('YYYY-MM-DD'),
          ptpAmount: ptpAmount,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          f_caseId: this.state.collection.caseId
        };
      } else if (!ptpDate && debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcome: outcome,
          outcomeNotes: newNote,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          debitResubmissionDate: moment(debitResubmissionDate).format('YYYY-MM-DD'),
          debitResubmissionAmount: debitResubmissionAmount,
          f_caseId: this.state.collection.caseId
        };
      } else if (ptpDate && debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          lastPTPDate: moment(ptpDate).format('YYYY-MM-DD'),
          lastPTPAmount: ptpAmount,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcome: outcome,
          outcomeNotes: newNote,
          ptpDate: moment(ptpDate).format('YYYY-MM-DD'),
          ptpAmount: ptpAmount,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          debitResubmissionDate: moment(debitResubmissionDate).format('YYYY-MM-DD'),
          debitResubmissionAmount: debitResubmissionAmount,
          f_caseId: this.state.collection.caseId
        };
      }

      await this.mysqlLayer.Put(`/${this.state.type}/customers/update_item/${this.state.clientId}/${this.state.collection.customerRefNo}`, customerUpdate);
      await this.mysqlLayer.Put(`/${this.state.type}/accounts/update_item/${this.state.clientId}/${this.state.collection.accountNumber}`, accountUpdate);
      await this.mysqlLayer.Put(`/${this.state.type}/cases/update_item/${this.state.clientId}/${this.state.collection.caseId}`, caseUpdate);

      await this.mysqlLayer.Post(`/${this.state.type}/outcomes/create_item/${this.state.clientId}`, outcomeInsert);
      this.props.history.push({
        pathname: '/workzone/collections',
        state: {
          recordStatus: 'Pended',
          clientId: this.state.clientId,
          type: this.state.type,
          workspace: this.state.workspace
        }
      });
    } else {
      problems.forEach(problem => Toasts('error', problem, true));
    }
  }

  async updateRecord() {
    const {
      contactPerson,
      debitResubmissionAmount,
      debitResubmissionDate,
      emailUsed,
      nextSteps,
      nextVisitDateTime,
      numberCalled,
      outcome,
      outcomeNotes,
      kamNotes,
      ptpDate,
      ptpAmount,
      role,
      transactionType,
      user
    } = this.state;
    const notes = this.state.outcomeNotes;
    const kamnotes = this.state.kamNotes;

    //console.log('nextVisitDateTime: ', nextVisitDateTime);

    // checking all the mandatory fields are populated
    let problems = [];
    if (role !== 'kam' && (!notes || notes.length < 10)) problems.push('Please enter a note longer than 10 characters');
    if (role === 'kam' && (!kamnotes || kamnotes.length < 10)) problems.push('Please enter a KAM note longer than 10 characters');
    if (emailUsed === null && transactionType === 'Email') problems.push('Please provide an email address');
    if (numberCalled === null && transactionType === 'Call') problems.push('Please provide a telephone number');
    if (numberCalled !== null && numberCalled.length > 11) problems.push('The telephone number can only be up to 11 digits long');
    if (nextVisitDateTime === null) problems.push('Please provide a next visit date and time');
    if (ptpDate && !ptpAmount) problems.push('Please provide a PTP amount');
    if (!ptpDate && ptpAmount) problems.push('Please provide a PTP date');
    if (debitResubmissionDate && !debitResubmissionAmount) problems.push('Please provide a debit resubmission amount');
    if (!debitResubmissionDate && debitResubmissionAmount) problems.push('Please provide a debit resubmission date');
    if (!outcome) problems.push('Please select an outcome resolution');

    if (problems.length === 0) {//if (notes && notes.length > 10 && nextVisitDateTime !== null && pendReason !== '---') {
      this.setState({ disabled: true });
      let oldNotes = this.state.collection.outcomeNotes ? this.state.collection.outcomeNotes + `\n\r` : '';
      let oldkamNotes = this.state.collection.kamNotes ? this.state.collection.kamNotes + `\n\r` : '';

      let newNote = oldNotes + outcomeNotes;
      let newkamNote = oldkamNotes + `${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')} by ${user}\nNote ${kamNotes}`;
      let closedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      let closedBy = user;

      let customerUpdate = {
        cipcStatus: this.state.cipcStatus,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      };

      let caseUpdate = {
        currentStatus: 'Open',
        nextVisitDateTime: nextVisitDateTime,
        kamNotes: newkamNote,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      };

      let outcomeInsert = '';
      let accountUpdate = '';
      if (!ptpDate && !debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcome: outcome,
          outcomeNotes: newNote,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          f_caseId: this.state.collection.caseId
        };
      } else if (ptpDate && !debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          lastPTPDate: moment(ptpDate).format('YYYY-MM-DD'),
          lastPTPAmount: ptpAmount,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcome: outcome,
          outcomeNotes: newNote,
          ptpDate: ptpDate,
          ptpAmount: ptpAmount,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          f_caseId: this.state.collection.caseId
        };
      } else if (!ptpDate && debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcome: outcome,
          outcomeNotes: newNote,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          debitResubmissionDate: moment(debitResubmissionDate).format('YYYY-MM-DD'),
          debitResubmissionAmount: debitResubmissionAmount,
          f_caseId: this.state.collection.caseId
        };
      } else if (ptpDate && debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          lastPTPDate: moment(ptpDate).format('YYYY-MM-DD'),
          lastPTPAmount: ptpAmount,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcome: outcome,
          outcomeNotes: newNote,
          ptpDate: ptpDate,
          ptpAmount: ptpAmount,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          debitResubmissionDate: moment(debitResubmissionDate).format('YYYY-MM-DD'),
          debitResubmissionAmount: debitResubmissionAmount,
          f_caseId: this.state.collection.caseId
        };
      }

      await this.mysqlLayer.Put(`/${this.state.type}/customers/update_item/${this.state.clientId}/${this.state.collection.customerRefNo}`, customerUpdate);
      await this.mysqlLayer.Put(`/${this.state.type}/accounts/update_item/${this.state.clientId}/${this.state.collection.accountNumber}`, accountUpdate);
      await this.mysqlLayer.Put(`/${this.state.type}/cases/update_item/${this.state.clientId}/${this.state.collection.caseId}`, caseUpdate);

      await this.mysqlLayer.Post(`/${this.state.type}/outcomes/create_item/${this.state.clientId}`, outcomeInsert);
      this.props.history.push({
        pathname: '/workzone/collections',
        state: {
          recordStatus: 'Open',
          clientId: this.state.clientId,
          type: this.state.type,
          workspace: this.state.workspace
        }
      });
    } else {
      problems.forEach(problem => Toasts('error', problem, true));
    }
  }

  async closeRecord() {
    const {
      contactPerson,
      debitResubmissionAmount,
      debitResubmissionDate,
      emailUsed,
      nextSteps,
      //nextVisitDateTime,
      numberCalled,
      outcome,
      outcomeNotes,
      kamNotes,
      ptpDate,
      ptpAmount,
      role,
      transactionType,
      user
    } = this.state;
    const notes = this.state.outcomeNotes;
    const kamnotes = this.state.kamNotes;

    // checking all the mandatory fields are populated
    let problems = [];
    if (role !== 'kam' && (!notes || notes.length < 10)) problems.push('Please enter a note longer than 10 characters');
    if (role === 'kam' && (!kamnotes || kamnotes.length < 10)) problems.push('Please enter a KAM note longer than 10 characters');
    if (emailUsed === null && transactionType === 'Email') problems.push('Please provide an email address');
    if (numberCalled === null && transactionType === 'Call') problems.push('Please provide a telephone number');
    if (numberCalled !== null && numberCalled.length > 11) problems.push('The telephone number can only be up to 11 digits long');
    if (ptpDate && !ptpAmount) problems.push('Please provide a PTP amount');
    if (!ptpDate && ptpAmount) problems.push('Please provide a PTP date');
    if (debitResubmissionDate && !debitResubmissionAmount) problems.push('Please provide a debit resubmission amount');
    if (!debitResubmissionDate && debitResubmissionAmount) problems.push('Please provide a debit resubmission date');
    if (!outcome) problems.push('Please select an outcome resolution');

    if (problems.length === 0) {//if (notes && notes.length > 10 && nextVisitDateTime !== null && pendReason !== '---') {
      this.setState({ disabled: true });
      let oldNotes = this.state.collection.outcomeNotes ? this.state.collection.outcomeNotes + `\n\r` : '';
      let oldkamNotes = this.state.collection.kamNotes ? this.state.collection.kamNotes + `\n\r` : '';

      let newNote = oldNotes + outcomeNotes;
      let newkamNote = oldkamNotes + `${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')} by ${user}\nNote ${kamNotes}`;
      let closedDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      let closedBy = user;

      let customerUpdate = {
        closedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        closedBy: user,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      };

      let caseUpdate = {
        currentStatus: 'Closed',
        //nextVisitDateTime: nextVisitDateTime,
        kamNotes: newkamNote,
        resolution: outcome,
        updatedBy: user,
        updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      };

      let outcomeInsert = '';
      let accountUpdate = '';
      if (!ptpDate && !debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcome: outcome,
          outcomeNotes: newNote,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          f_caseId: this.state.collection.caseId
        };
      } else if (ptpDate && !debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          lastPTPDate: moment(ptpDate).format('YYYY-MM-DD'),
          lastPTPAmount: ptpAmount,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcome: outcome,
          outcomeNotes: newNote,
          ptpDate: ptpDate,
          ptpAmount: ptpAmount,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          f_caseId: this.state.collection.caseId
        };
      } else if (!ptpDate && debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcome: outcome,
          outcomeNotes: newNote,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          debitResubmissionDate: moment(debitResubmissionDate).format('YYYY-MM-DD'),
          debitResubmissionAmount: debitResubmissionAmount,
          f_caseId: this.state.collection.caseId
        };
      } else if (ptpDate && debitResubmissionDate) {

        accountUpdate = {
          accountStatus: this.state.accountStatus,
          lastPTPDate: moment(ptpDate).format('YYYY-MM-DD'),
          lastPTPAmount: ptpAmount,
          updatedBy: user,
          updatedDate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        };

        outcomeInsert = {
          createdBy: user,
          outcomeStatus: 'Closed',
          transactionType: transactionType,
          numberCalled: numberCalled,
          emailUsed: emailUsed,
          contactPerson: contactPerson,
          outcome: outcome,
          outcomeNotes: newNote,
          ptpDate: ptpDate,
          ptpAmount: ptpAmount,
          nextSteps: nextSteps,
          closedDate: closedDate,
          closedBy: closedBy,
          debitResubmissionDate: moment(debitResubmissionDate).format('YYYY-MM-DD'),
          debitResubmissionAmount: debitResubmissionAmount,
          f_caseId: this.state.collection.caseId
        };
      }

      await this.mysqlLayer.Put(`/${this.state.type}/customers/update_item/${this.state.clientId}/${this.state.collection.customerRefNo}`, customerUpdate);
      await this.mysqlLayer.Put(`/${this.state.type}/accounts/update_item/${this.state.clientId}/${this.state.collection.accountNumber}`, accountUpdate);
      await this.mysqlLayer.Put(`/${this.state.type}/cases/update_item/${this.state.clientId}/${this.state.collection.caseId}`, caseUpdate);

      await this.mysqlLayer.Post(`/${this.state.type}/outcomes/create_item/${this.state.clientId}`, outcomeInsert);
      this.props.history.push({
        pathname: '/workzone/collections',
        state: {
          recordStatus: 'Open',
          clientId: this.state.clientId,
          type: this.state.type,
          workspace: this.state.workspace
        }
      });
    } else {
      problems.forEach(problem => Toasts('error', problem, true));
    }
  }*/

  render() {
    if (this.state.collection === null ) {
      return <p>Loading...</p>;
    } else {
      const collection = this.state.collection;
      const role = sessionStorage.getItem('cwsRole');

      let paymentDueDate = '';
      if (this.state.collection.paymentDueDate !== undefined) {
        paymentDueDate = this.state.collection.paymentDueDate ?
          moment(collection.paymentDueDate).format('YYYY-MM-DD') :
          '';
      }

      const debitOrderDate = this.state.collection.debitOrderDate ?
        moment(collection.debitOrderDate).format('YYYY-MM-DD') :
        '';

      const lastPaymentDate = this.state.collection.lastPaymentDate ?
        moment(collection.lastPaymentDate).format('YYYY-MM-DD') :
        '';

      const lastPTPDate = this.state.collection.lastPTPDate ?
        moment(collection.lastPTPDate).format('YYYY-MM-DD') :
        '';

      //this.state.outcomeRecords.forEach(record => console.log('nvdt: ', record.id, record.nextVisitDateTime));
      let nextVisitDateTime = '';
      if (collection.nextVisitDateTime !== undefined) {
        nextVisitDateTime = collection.nextVisitDateTime ?
          moment(collection.nextVisitDateTime).format('YYYY-MM-DD HH:mm:ss') :
          '';
      }
      //console.log('render nextVisitDateTime: ', nextVisitDateTime);

      let outcomesNotes = '';
      if (this.state.outcomeRecords.length > 0 && this.state.outcomeRecords[0].outcomeNotes !== undefined) {
        let outcomesNotesArray = [];
        //console.log('this.state.outcomeRecords: ', this.state.outcomeRecords);
        this.state.outcomeRecords.forEach((outcomeRecord, idx) => {
          //console.log('outcomeRecord.outcomeNotes: ', outcomeRecord.outcomeNotes);
          outcomesNotesArray[idx] = `${idx + 1}: ` + outcomeRecord.outcomeNotes + '\n\r'
        });
        //console.log('outcomesNotes before: ', outcomesNotes);
        outcomesNotes = outcomesNotesArray.join('\n');
        //console.log('outcomesNotes after: ', outcomesNotes);
      } else {
        outcomesNotes = 'No notes to display';
      }

      let outcomes = '';
      if (this.state.outcomeRecords.length > 0 && this.state.outcomeRecords[0].outcomeResolution !== undefined) {
        let outcomeArray = [];
        this.state.outcomeRecords.forEach((outcomeRecord, idx) => {
          let ptpDate = outcomeRecord.ptpDate ? moment(outcomeRecord.ptpDate).format('YYYY-MM-DD') : '--';
          let debitResubmissionDate = outcomeRecord.debitResubmissionDate ? moment(outcomeRecord.debitResubmissionDate).format('YYYY-MM-DD') : '--';

          outcomeArray[idx] = moment(outcomeRecord.createdDate).format('YYYY-MM-DD HH:mm:ss') + ' by user ' + outcomeRecord.createdBy + '\n' +
          'Transaction type: ' + outcomeRecord.transactionType + '\n' +
          'Contacted person: ' + outcomeRecord.contactPerson + '\n' +
          'Number called: ' + outcomeRecord.numberCalled + '\n' +
          'Email used: ' + outcomeRecord.emailUsed + '\n' +
          'PTP date: ' + ptpDate + '\n' +
          'PTP amount: R' + outcomeRecord.ptpAmount + '\n' +
          'Pend reason: ' + outcomeRecord.pendReason + '\n' +
          'Debit order resubmission date: ' + debitResubmissionDate + '\n' +
          'Debit order resubmission amount: R' + outcomeRecord.debitResubmissionAmount + '\n' +
          'Outcome resolution: ' + outcomeRecord.outcomeResolution + '\n' +
          'Next visit date and time: ' + moment(outcomeRecord.nextVisitDateTime).format('YYYY-MM-DD HH:mm:ss') + '\n' +
          'Next steps: ' + outcomeRecord.nextSteps + '\n' +
          'Outcome notes: \n' + outcomesNotes + '\n' +
          '-----------------------------------------\n\r'
        });
        outcomes = outcomeArray.join('\n');
      } else {
        outcomes = 'No outcomes to display';
      }

      const resolutionList = [<option key="0" value="---">Outcome Resolution</option>];
      //console.log('resolutionList before: ', resolutionList);
      resolutionList.push(this.state.resolutions.map(resolution =>
        <option key={resolution.id} value={resolution.resolution}>{resolution.resolution}</option>
      ));

      const pendList = [<option key="0" value="---">Pend Reason</option>];
      //console.log('pendList before: ', pendList);
      pendList.push(this.state.pendReasons.map(pend =>
        <option key={pend.id} value={pend.pendreason}>{pend.pendreason}</option>
      ));

      const transactionTypeList = [<option key="0" value="---">Transaction Type</option>];
      //console.log('pendList before: ', pendList);
      transactionTypeList.push(this.state.transactionTypes.map(type =>
        <option key={type.id} value={type.transactiontype}>{type.transactiontype}</option>
      ));

      const userList = [<option key="0" value={this.state.user}>Me</option>];
      userList.push(this.state.users.map(user =>
        <option key={user.id} value={user.email}>{user.firstName} {user.surname} -- {user.email}</option>
      ));

      const accountStatusList = [<option key="0" value={this.state.collection.accountStatus}>{this.state.collection.accountStatus}</option>];
      accountStatusList.push(this.state.accountStatuses.map(accountStatus =>
        <option key={accountStatus.id} value={accountStatus.accountStatus}>{accountStatus.accountStatus}</option>
      ));

      const cipcStatusList = [<option key="0" value={this.state.collection.regIdStatus}>{this.state.collection.regIdStatus}</option>];
      cipcStatusList.push(this.state.cipcStatuses.map(cipcStatus =>
        <option key={cipcStatus.id} value={cipcStatus.cipcStatus}>{cipcStatus.cipcStatus}</option>
      ));

      const idvStatusList = [<option key="0" value={this.state.collection.regIdStatus}>{this.state.collection.regIdStatus}</option>];
      idvStatusList.push(this.state.idvStatuses.map(idvStatus =>
        <option key={idvStatus.id} value={idvStatus.idvStatus}>{idvStatus.idvStatus}</option>
      ));

      /*const idvStatusList = <>
        <option key="1" value="option1">Option 1</option>
        <option key="2" value="option2">Option 2</option></>
      ;*/

      let repNumber = (this.state.contactRecords[0].representativeNumber) ? `tel:${this.state.contactRecords[0].representativeNumber}` : '00000';

      // Setting dates earlier than today as disabled for Next Date and Time
      const yesterday = DateTime.moment().subtract( 1, 'day' );
      const valid = function( current ){
        return current.isAfter( yesterday );
      };

      return (

        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card border-primary">
                <div className="card-header">Case Number {collection.caseId}</div>
                <div className="card-body text-left">

                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="accountNotes">Account Number {collection.accountNumber} - Notes</label>
                      <textarea
                        disabled={true}
                        rows="3"
                        name="accountNotes"
                        className="form-control"
                        value={this.state.collection.accountNotes || ''}
                      />
                    </div>
                  </div>
                </div>

                <br />

                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="caseNotes">Case Notes</label>
                      <textarea
                        disabled={true}
                        rows="3"
                        name="caseNotes"
                        className="form-control"
                        value={this.state.collection.caseNotes || ''}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="kamNotes">KAM Notes</label>
                      <textarea
                        disabled={true}
                        rows="3"
                        name="kamNotes"
                        className="form-control"
                        value={this.state.collection.kamNotes || ''}
                      />
                    </div>
                  </div>
                </div>

                <br />

                <div className="row">
                  <div className="col-8">
                    <div className="form-group">
                      <label htmlFor="customerName">Customer Name</label>
                      <input
                        disabled={true}
                        type="text"
                        name="customerName"
                        className="form-control"
                        value={collection.customerName || ''}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="customerAnalysis">Customer Analysis</label>
                      <input
                        disabled={true}
                        type="text"
                        name="customerAnalysis"
                        className="form-control"
                        value={collection.customerAnalysis || ''}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-4">
                    {
                      collection.customerEntity === 'Enterprise' &&
                      <div className="form-group">
                        <label htmlFor="RegNumber">Reg Number</label>
                        <input
                          disabled={true}
                          type="text"
                          name="regIdNumber"
                          className="form-control"
                          value={collection.regIdNumber || ''}
                        />
                      </div>
                    }

                    {
                      collection.customerEntity === 'Consumer' &&
                      <div className="form-group">
                        <label htmlFor="IdNumber">ID Number</label>
                        <input
                          disabled={true}
                          type="text"
                          name="regIdNumber"
                          className="form-control"
                          value={collection.regIdNumber || ''}
                        />
                      </div>
                    }
                  </div>

                  <div className="col-4">
                    {
                      collection.customerEntity === 'Enterprise' &&
                      <div className="form-group">
                        <label htmlFor="cipcStatus">CIPC Status</label>
                        <select
                          required
                          name="regIdStatus"
                          className="custom-select"
                          onChange={(e) => {this.handleChange(e)}}
                        >
                          {cipcStatusList}
                        </select>
                      </div>
                    }

                    {
                      collection.customerEntity === 'Consumer' &&
                      <div className="form-group">
                        <label htmlFor="cipcStatus">IDV Status</label>
                        <select
                          required
                          name="regIdStatus"
                          className="custom-select"
                          onChange={(e) => {this.handleChange(e)}}
                        >
                          {idvStatusList}
                        </select>
                      </div>
                    }
                  </div>

                  <div className="col-4">
                    <div className="form-group">

                    </div>
                  </div>
                </div>

                <br />

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="debtorAge">Debtor Age</label>
                      <input
                        disabled={true}
                        type="number"
                        name="debtorAge"
                        className="form-control"
                        value={collection.debtorAge || 0}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="creditLimit">Credit Limit</label>
                      <NumberFormat
                        disabled={true}
                        displayType={'input'}
                        name="creditLimit"
                        className="form-control"
                        thousandSeparator={true}
                        prefix={'R '}
                        value={collection.creditLimit.toFixed(2) || 0}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="totalBalance">Total Balance</label>
                      <NumberFormat
                        displayType={'input'}
                        name="totalBalance"
                        className="form-control"
                        disabled={true}
                        thousandSeparator={true}
                        prefix={'R '}
                        value={collection.totalBalance.toFixed(2) || 0}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="amountDue">Amount Due</label>
                      <NumberFormat
                        disabled={true}
                        displayType={'input'}
                        name="amountDue"
                        className="form-control"
                        thousandSeparator={true}
                        prefix={'R '}
                        value={collection.amountDue.toFixed(2) || 0}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="currentBalance">Current Balance</label>
                      <NumberFormat
                        disabled={true}
                        displayType={'input'}
                        name="currentBalance"
                        className="form-control"
                        thousandSeparator={true}
                        prefix={'R '}
                        value={collection.currentBalance.toFixed(2) || 0}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="accountStatus">Account Status</label>
                      <select className="custom-select"
                        required
                        name="accountStatus"
                        onChange={this.handleChange}
                      >
                        {accountStatusList}
                      </select>
                    </div>
                  </div>
                </div>

                <br /><br />

                <div className="row">
                  <div className="col-3">
                    <div className="form-group">
                      <label htmlFor="days30">30 Days</label>
                      <NumberFormat
                        disabled={true}
                        displayType={'input'}
                        name="days30"
                        className="form-control"
                        thousandSeparator={true}
                        prefix={'R '}
                        value={collection.days30.toFixed(2) || 0}
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <div className="form-group">
                      <label htmlFor="days60">60 Days</label>
                      <NumberFormat
                        disabled={true}
                        displayType={'input'}
                        name="days60"
                        className="form-control"
                        thousandSeparator={true}
                        prefix={'R '}
                        value={collection.days60.toFixed(2) || 0}
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <div className="form-group">
                      <label htmlFor="days90">90 Days</label>
                      <NumberFormat
                        disabled={true}
                        displayType={'input'}
                        name="days90"
                        className="form-control"
                        thousandSeparator={true}
                        prefix={'R '}
                        value={collection.days90.toFixed(2) || 0}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-3">
                    <div className="form-group">
                      <label htmlFor="days120">120 Days</label>
                      <NumberFormat
                        disabled={true}
                        displayType={'input'}
                        name="days120"
                        className="form-control"
                        thousandSeparator={true}
                        prefix={'R '}
                        value={collection.days120.toFixed(2) || 0}
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <div className="form-group">
                      <label htmlFor="days150">150 Days</label>
                      <NumberFormat
                        disabled={true}
                        displayType={'input'}
                        name="days150"
                        className="form-control"
                        thousandSeparator={true}
                        prefix={'R '}
                        value={collection.days150.toFixed(2) || 0}
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <div className="form-group">
                      <label htmlFor="days180">180 Days</label>
                      <NumberFormat
                        disabled={true}
                        displayType={'input'}
                        name="days180"
                        className="form-control"
                        thousandSeparator={true}
                        prefix={'R '}
                        value={collection.days180.toFixed(2) || 0}
                      />
                    </div>
                  </div>

                  <div className="col-3">
                    <div className="form-group">
                      <label htmlFor="days180Over">+180 Days</label>
                      <NumberFormat
                        disabled={true}
                        displayType={'input'}
                        name="days180Over"
                        className="form-control"
                        thousandSeparator={true}
                        prefix={'R '}
                        value={collection.days180Over.toFixed(2) || 0}
                      />
                    </div>
                  </div>
                </div>

                <br /><br />

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="paymentDueDate">Payment Due Date</label>
                      <input
                        disabled={true}
                        type="text"
                        name="paymentDueDate"
                        className="form-control"
                        value={paymentDueDate}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="debitOrderDate">Debit Order Date</label>
                      <input
                        disabled={true}
                        type="text"
                        name="debitOrderDate"
                        className="form-control"
                        value={debitOrderDate}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      {/* This space left blank intentionally */}
                    </div>
                  </div>
                </div>

                <br /><br />

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="lastPaymentDate">Last Payment Date</label>
                      <input
                        disabled={true}
                        type="text"
                        name="lastPaymentDate"
                        className="form-control"
                        value={lastPaymentDate}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="lastPaymentAmount">Last Payment Amount</label>
                      <NumberFormat
                        disabled={true}
                        displayType={'input'}
                        className="form-control"
                        thousandSeparator={true}
                        prefix={'R '}
                        name="lastPaymentAmount"
                        value={collection.lastPaymentAmount.toFixed(2) || 0}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      {/* This space left blank intentionally */}
                    </div>
                  </div>
                </div>

                <br /><br />

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="ptpDate">Last PTP Date</label>
                      <input
                        disabled={true}
                        type="text"
                        name="lastPTPDate"
                        className="form-control"
                        value={lastPTPDate}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="ptpAmount">Last PTP Amount</label>
                      <NumberFormat
                        disabled={true}
                        displayType={'input'}
                        name="lastPTPAmount"
                        className="form-control"
                        thousandSeparator={true}
                        prefix={'R '}
                        value={collection.lastPTPAmount.toFixed(2) || 0}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      {/* This space left blank intentionally */}
                    </div>
                  </div>
                </div>

                <br /><br />

                <div className="row">
                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="nextVisitDateTime">Next Visit Date and Time</label>
                      <input
                        disabled={true}
                        type="text"
                        name="nextVisitDateTime"
                        className="form-control"
                        value={nextVisitDateTime}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="repName">Representative Name</label>
                      <input
                        disabled={true}
                        type="text"
                        name="representativeName"
                        className="form-control"
                        value={this.state.contactRecords[0].representativeName || ''}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group">
                      <label htmlFor="representativeNumber">Representative Number</label>
                      <a
                        href={repNumber}
                        style={{
                          background: "#ECF0F1",
                          border: "1px solid #CED4DA",
                          borderRadius: "0.25rem",
                          color: "#7B8A8B",
                          display: "block",
                          fontSize: "0.9375rem",
                          fontWeight: "400",
                          lineHeight: "1.5",
                          margin: "0",
                          padding: "0.375rem 0.75rem",
                          textDecoration: "underline",
                          width: "100%"
                        }}
                      >
                        {repNumber.substring(4)}
                      </a>

                    </div>
                  </div>
                </div>

                <Contacts
                  contacts={this.state.contactRecords[0]}
                  accountNumber={collection.accountNumber}
                  clientId={this.state.clientId}
                />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="form-group">
                {/* This space left blank intentionally */}
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="form-group">
              {/* This space left blank intentionally */}
            </div>
          </div>

  {/* --------------------------------------------- Outcome History section ------------------------------------------------------- */}
          <div className="row">
            <div className="col-12">
              <div className="card border-primary">
                <div className="card-header">Outcome History</div>
                <div className="card-body text-left">

                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="outcomes">Outcomes</label>
                        <textarea
                          disabled={true}
                          rows="10"
                          name="outcomes"
                          className="form-control"
                          value={outcomes}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="row">
            <div className="row">
              <div className="col-12">
                <div className="form-group">
                  {/* This space left blank intentionally */}
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  {/* This space left blank intentionally */}
                </div>
              </div>
            </div>

  {/* --------------------------------------------- New activity section ------------------------------------------------------- */}
            <div className="col-12">
              <div className="card border-primary">
                <div className="card-header">New Case Activity</div>
                <div className="card-body text-left">

                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="transactionType">Transaction Type</label>
                        <select className="custom-select"
                          required
                          name="transactionType"
                          onChange={this.handleChange}
                        >
                        {transactionTypeList}
                        </select>
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="numberCalled">Number Called</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="numberCalled"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          value={this.state.numberCalled || ''}
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="contactPerson">Person Contacted</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="contactPerson"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          value={this.state.contactPerson || ''}
                        />
                      </div>
                    </div>

                  </div>

                  <div className="row">
                    <div className="col-8">
                      <div className="form-group">
                        <label htmlFor="emailUsed">Email Used</label>
                        <input
                          disabled={this.state.disabled}
                          type="text"
                          name="emailUsed"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          value={this.state.emailUsed || ''}
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        {/* This space left intentionally blank */}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="ptpDate">PTP Date</label>
                        <DateTime
                          isValidDate={ valid }
                          onBlur={this.handlePTPDate}
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="ptpAmount">PTP Amount</label>
                        <NumberFormat
                          displayType={'input'}
                          className="form-control"
                          prefix={'R '}
                          thousandSeparator={true}
                          disabled={false}
                          name="debitResubmissionAmount"
                          onValueChange={(values) => {
                            this.setState({ ptpAmount: values.floatValue })}}
                          value={this.state.ptpAmount || ''}
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="resolution">Outcome Resolution</label>
                        <select className="custom-select"
                          required
                          name="outcomeResolution"
                          onChange={this.handleChange}
                        >
                        {resolutionList}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="debitResubmissionDate">Debit Resubmission Date</label>
                        <DateTime
                          isValidDate={ valid }
                          onBlur={this.handleDebitDate}
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="debitResubmissionAmount">Debit Resubmission Amount</label>
                        <NumberFormat
                          displayType={'input'}
                          className="form-control"
                          prefix={'R '}
                          thousandSeparator={true}
                          disabled={false}
                          name="debitResubmissionAmount"
                          onValueChange={(values) => {
                            this.setState({ debitResubmissionAmount: values.floatValue })}}
                          value={this.state.debitResubmissionAmount || ''}
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="pendReason">Pend Reason</label>
                        <select className="custom-select"
                          required
                          name="pendReason"
                          onChange={this.handleChange}
                        >
                        {pendList}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      {(role === 'kam') && (<div className="form-group">
                        <label htmlFor="kamNotes">KAM Case Notes</label>
                        <textarea
                          disabled={this.state.disabled}
                          type="text"
                          rows="3"
                          name="kamNotes"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="Remember to provide clear notes"
                        />
                      </div>)}

                      {(role !== 'kam') && (<div className="form-group">
                        <label htmlFor="outcomeNotes">Outcome Notes</label>
                        <textarea
                          disabled={this.state.disabled}
                          type="text"
                          rows="3"
                          name="outcomeNotes"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          placeholder="Remember to provide clear notes"
                        />
                      </div>)}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="nextVisitDateTime">Next Visit Date and Time</label>
                        <DateTime
                          isValidDate={ valid }
                          onBlur={this.handleDate}
                        />
                      </div>
                    </div>

                    <div className="col-4">
                      <div className="form-group">
                        <label htmlFor="userList">Assignment</label>
                        <select className="custom-select"
                          required
                          name="currentAssignment"
                          onChange={this.handleChange}
                        >
                          {userList}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <label htmlFor="nextSteps">Next Steps</label>
                        <textarea
                          disabled={this.state.disabled}
                          type="text"
                          rows="8"
                          name="nextSteps"
                          onChange={(e) => {this.handleChange(e)}}
                          className="form-control"
                          value={this.state.nextSteps || ''}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">

                <div className="card-body text-center">

                  <div className="row">
                    <div className="col-12">
                      <button
                        disabled={this.state.disabled}
                        className="btn btn-primary"
                        onClick={() => {this.processRecord('Pended')}}
                        style={{ margin: "5px" }}
                      >
                        Save and Pend
                      </button>

                      <button
                        disabled={this.state.disabled}
                        className="btn btn-primary"
                        onClick={() => {this.processRecord('Closed')}}
                        style={{ margin: "5px" }}
                      >
                        Close
                      </button>

                      <button
                        disabled={this.state.disabled}
                        className="btn btn-primary"
                        onClick={() => {this.processRecord('Updated')}}
                        style={{ margin: "5px" }}
                      >
                        Update
                      </button>

                      <button
                        disabled={this.state.disabled}
                        className="btn btn-primary"
                        onClick={() => {this.cancel()}}
                        style={{ margin: "5px" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>

            </div>
          </div>
          <ToastContainer />

        </div>
      )
    }
  }
}

export default Collection;

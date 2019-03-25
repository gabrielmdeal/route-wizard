import * as Formatters from '../lib/formatters';
import * as Spreadsheet from '../lib/climate/spreadsheet';
import compose from 'recompose/compose';
import daymetClient from '../lib/climate/daymetClient';
import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import ReadFileButton from '../components/readFileButton';
import SpreadsheetTable from '../components/spreadsheet/table';
import withCss from '../components/withCss';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  footer: { marginTop: '1em' },
};

class ClimatePage extends React.Component {
  state = {
    workBook: null,
    // FIXME: rename progressMessage:
    progressMessage:
      'The spreadsheet should have latitude, longitude, & date columns.',
    queries: null,
    isLoading: false,
  };
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  columns() {
    if (!this.state.queries) {
      return [];
    }

    return Object.entries(Formatters.typeMappings).map(([key, [name]]) => ({
      name,
      key,
    }));
  }

  isEmpty(value) {
    return value === null || value === '' || typeof value === 'undefined';
  }

  rows() {
    const columns = this.columns();
    if (!this.state.queries || columns.length == 0) {
      return [];
    }

    return this.state.queries.map((query) =>
      columns.map((column) => {
        const value = query[column.key];
        if (this.isEmpty(value)) {
          return ''; // FIXME: display a message.
        }

        const columnType = Formatters.typeMappings[column.key];
        if (columnType) {
          return columnType[1](value);
        }

        return query[column.key].toString();
      })
    );
  }

  // FIXME: Share this?
  msg(data, progressMessage) {
    this.setState({ progressMessage: progressMessage + '...' });

    return new Promise((resolve) => {
      // Pause a bit after setting the progress message to give us a chance to render.
      const timeoutCallback = () => resolve(data);
      const timeoutMs = 500;
      setTimeout(timeoutCallback, timeoutMs);
    });
  }

  handleReadFile = (event) => {
    this.setState({
      workBook: null,
      queries: null,
      isLoading: true,
      errorMessage: null,
      notificationMessage: null,
      progressMessage: 'Reading file contents',
    });

    Spreadsheet.readRawData(event)
      .then((data) => this.msg(data, 'Parsing spreadsheet'))
      .then(Spreadsheet.parse)
      .then(({ workBook, errorMessage, queries }) => {
        if (errorMessage) {
          throw errorMessage;
        }

        this.setState({ workBook, queries });
        return queries;
      })
      .then((data) => this.msg(data, 'Querying Daymet for climate data'))
      .then((queries) => daymetClient({ queries }))
      .then((responses) => {
        const updatedQueries = this.state.queries.map((query, index) =>
          Object.assign({}, query, responses[index])
        );

        this.setState({
          queries: updatedQueries,
          progressMessage: null,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          errorMessage: error,
          progressMessage: null,
          notificationMessage: null,
          isLoading: false,
        });
      });
  };

  render() {
    return (
      <Layout>
        <h1>Add climate data to spreadsheet (beta)</h1>
        <ReadFileButton
          isLoading={this.state.isLoading}
          onChange={this.handleReadFile}
          errorMessage={this.state.errorMessage}
          notificationMessage={this.state.notificationMessage}
          progressMessage={this.state.progressMessage}
        >
          Read spreadsheet
        </ReadFileButton>
        <SpreadsheetTable
          columns={this.columns()}
          isLoading={this.state.isLoading}
          rows={this.rows()}
        />
        <div className={this.props.classes.footer}>
          Climate data source: <a href="https://daymet.ornl.gov/">Daymet</a>
        </div>
      </Layout>
    );
  }
}

const enhance = compose(
  withCss, // Keep this first.
  withStyles(styles)
);

export default enhance(ClimatePage);

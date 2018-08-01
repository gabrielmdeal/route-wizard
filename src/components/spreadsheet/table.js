import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    paddingLeft: theme.spacing.unit * 1,
    paddingRight: theme.spacing.unit * 1,
    width: '100%',
  },
  table: {
    minWidth: 700,
  },
});

class Spreadsheet extends React.Component {
  renderTableHead() {
    const tableCells = this.props.columns.map((column, index) => (
      <TableCell key={index}>{column.name}</TableCell>
    ));

    return (
      <TableHead>
        <TableRow>{tableCells}</TableRow>
      </TableHead>
    );
  }

  renderTableBody() {
    const tableRows = this.props.rows.map((row, rowIndex) => (
      <TableRow key={rowIndex}>
        {this.props.columns.map((column, columnIndex) => (
          <TableCell key={columnIndex}>{row[columnIndex]}</TableCell>
        ))}
      </TableRow>
    ));

    return <TableBody>{tableRows}</TableBody>;
  }

  render() {
    return (
      <Paper className={this.props.classes.root}>
        <Table className={this.props.classes.table}>
          {this.renderTableHead()}
          {this.renderTableBody()}
        </Table>
      </Paper>
    );
  }
}

Spreadsheet.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
};

const enhance = withStyles(styles);

export default enhance(Spreadsheet);
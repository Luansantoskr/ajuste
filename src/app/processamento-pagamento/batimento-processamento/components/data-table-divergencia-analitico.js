import Paper from '@material-ui/core/Paper'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import PropTypes from 'prop-types'
import React from 'react'
import Loading from '../../../../components/loading'
import TablePaginationActions from '../../../../components/table/TablePaginationAction'
import green from '@material-ui/core/colors/green'

function desc (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function stableSort (array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

function getSorting (order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}

const rows = [
  {
    id: 'DATA',
    numeric: false,
    disablePadding: false,
    label: 'DATA'
  },
  {
    id: 'NOSSONUMERO',
    numeric: false,
    disablePadding: false,
    label: 'NOSSO NUMERO'
  },
  {
    id: 'VALOR',
    numeric: false,
    disablePadding: false,
    label: 'VALOR'
  },
  {
    id: 'CEDENTE',
    numeric: false,
    disablePadding: false,
    label: 'CEDENTE'
  },
  {
    id: 'CONTA',
    numeric: true,
    disablePadding: false,
    label: 'CONTA'
  },
  {
    id: 'STATUS',
    numeric: true,
    disablePadding: false,
    label: 'STATUS'
  }
]

const stylesHead = theme => ({
  headStyle: {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'bold',
    borderBottom: '2px solid #D6D6D6'
  }
})

class DataTableRetornoAnaliticoCortesHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const { order, orderBy, classes } = this.props

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                className={classes.headStyle}
                key={row.id}
                align={'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                {row.label.toUpperCase()}
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    )
  }
}

DataTableRetornoAnaliticoCortesHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}
const DataTableRetornoAnaliticoCortesHeadComponent = withStyles(stylesHead, {
  withTheme: true
})(DataTableRetornoAnaliticoCortesHead)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: '20px'
  },
  table: {
    maxWidth: '100%',
    minWidth: '10%',
    overflowX: 'auto',
    padding: '20px'
  },
  select: {
    paddingRight: 25
  },
  tableBodyRow: {
    borderBottom: '1px solid #D6D6D6',
    textOverflow: '…',
    minWidth: '100px',
    maxWidth: '120px',
    marginRight: '30px',
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  text: {
    fontSize: '12px',
    fontFamily: 'Helvetica',
    lineHeight: '1.6',
    letterSpacing: '0.0075em'
  },
  empytyTable: {
    display: 'flex',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)',
    marginLeft: `${rows.length * 30}%`,
    marginTop: '20px'
  }
})

const muiDatatableTheme = createMuiTheme({
  palette: {
    secondary: {
      main: green[600]
    }
  },
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        maxHeight: 'none',
        webkitScrollbarThumb: 'active'
      }
    },
    MuiTableCell: {
      root: {
        padding: '0px 20px 0px 0px',
        // whiteSpace: 'nowrap',
        position: 'relative',
        zIndex: 0,
        backgroundColor: '#fff',
        borderBottom: 0
      }
    },
    MuiTableRow: {
      footer: {
        height: 40
      }
    },
    select: {
      paddingRight: '50px',
      width: 200
    },
    MuiIconButton: {
      root: {
        // override no root do componente
        padding: 6,
        borderRadius: 10
      }
    }
  }
})

class DataTableRetornoAnalitico extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: this.props.data,
    page: 0,
    rowsPerPage: 5,
    open: false
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }))
      return
    }
    this.setState({ selected: [] })
  }

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    this.setState({ selected: newSelected })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1

  render () {
    const { classes } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        {!data ? (
          <Loading />
        ) : (
          <Paper className={classes.root}>
            <Table className={classes.table} aria-labelledby='tableTitle'>
              <DataTableRetornoAnaliticoCortesHeadComponent
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={this.state.data.length}
              />

              <TableBody>
                {data.length === 0 ? (
                  <span className={classes.empytyTable}>NENHUM REGISTRO ENCONTRADO</span>
                ) : (
                  stableSort(data, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(item => {
                      const isSelected = this.isSelected(item.id)
                      return (
                        <TableRow
                          hover
                          role='checkbox'
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={Math.random()}
                        >
                          <TableCell className={classes.tableBodyRow} align='left'>
                            <span className={classes.text}>{item.DATA}</span>
                          </TableCell>
                          <TableCell className={classes.tableBodyRow} align='left'>
                            <span className={classes.text}>{item.NOSSONUMERO}</span>
                          </TableCell>
                          <TableCell className={classes.tableBodyRow} align='left'>
                            <span className={classes.text}>{item.VALOR}</span>
                          </TableCell>
                          <TableCell className={classes.tableBodyRow} align='left'>
                            <span className={classes.text}>{item.CEDENTE}</span>
                          </TableCell>
                          <TableCell className={classes.tableBodyRow} align='left'>
                            <span className={classes.text}>{item.CONTA}</span>
                          </TableCell>
                          <TableCell className={classes.tableBodyRow} align='left'>
                            <span className={classes.text}>{item.STATUS}</span>
                          </TableCell>
                        </TableRow>
                      )
                    })
                )}
              </TableBody>
            </Table>

            <TablePaginationActions
              rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              labelRowsPerPage={'Linhas Por Página'}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </MuiThemeProvider>
    )
  }
}

DataTableRetornoAnalitico.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableRetornoAnalitico)
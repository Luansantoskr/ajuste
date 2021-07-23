import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import { createMuiTheme, withStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import DescriptionIcon from '@material-ui/icons/Description'
import PropTypes from 'prop-types'
import React from 'react'
// import formatDate from '../../../../util/date'
import Loading from '../../../../components/loading'
import TablePaginationActions from '../../../../components/table/TablePaginationAction'
import exportCSVFile from '../../../../util/exportCSVFile'
import Api from '../../../../services/Api'
import Snackbar from '../../../../components/snackbar'
import FilterData from './FilterData'

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
    id: 'dtLiquidacao',
    numeric: false,
    disablePadding: false,
    label: 'DT LIQUIDAÇÃO'
  },
  {
    id: 'qtdUr',
    numeric: false,
    disablePadding: false,
    label: 'QTD UR'
  },
  {
    id: 'qtdTag',
    numeric: true,
    disablePadding: false,
    label: 'QTD TAG'
  },
  {
    id: 'urXtag',
    numeric: true,
    disablePadding: false,
    label: 'VERIFICAÇÃO'
  },
  {
    id: 'valorUr',
    numeric: true,
    disablePadding: false,
    label: 'VALOR UR'
  },
  {
    id: 'valorTag',
    numeric: true,
    disablePadding: false,
    label: 'VALOR_TAG'
  },
  {
    id: 'urXtagValor',
    numeric: false,
    disablePadding: false,
    label: 'VERIFICAÇÃO TAG'
  },
  {
    id: 'troca',
    numeric: true,
    disablePadding: false,
    label: 'TROCA'
  },
  {
    id: 'validado',
    numeric: true,
    disablePadding: false,
    label: 'VALIDADO'
  },
  {
    id: 'erro',
    numeric: true,
    disablePadding: false,
    label: 'ERRO'
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

class DataTableHistoricoCortesHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property)
  }

  render () {
    const { classes, numSelected, onSelectAllClick, rowCount } = this.props

    return (
      <TableHead>
        <TableRow>
          <TableCell className={classes.headStyle} padding='checkbox'>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount | (numSelected > 0 && numSelected < rowCount)}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                className={classes.headStyle}
                key={row.id}
                align={'left'}
                padding={row.disablePadding ? 'none' : 'default'}
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

DataTableHistoricoCortesHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}
const DataTableHistoricoCortesHeadComponent = withStyles(stylesHead, {
  withTheme: true
})(DataTableHistoricoCortesHead)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: '10px'
  },
  table: {
    maxWidth: '100%',
    minWidth: '10%',
    overflowX: 'auto',
    padding: '10px'
  },
  select: {
    paddingRight: 25
  },
  tableBodyRow: {
    borderBottom: '1px solid #D6D6D6'
  },
  cellRowStyle: {
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)'
  },
  sucesso: {
    color: '#008B45'
  },
  falha: {
    color: '#d62133'
  },
  textInsideTable: {
    fontSize: '11px'
  },
  empytyTable: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontSize: '13px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.54)',
    margin: '17px'
  },
  innerLoad: {
    display: 'flex',
    marginLeft: `${rows.length * 10}%`
  }
})

const muiDatatableTheme = createMuiTheme({
  palette: {
    secondary: {
      main: green[600]
    },
    primary: green
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
        padding: '0px 0px 0px 0px',
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
    },
    MuiToolbar: {
      root: {
        // override no root do componente
        paddingleft: 0
      },
      gutters: {
        paddingleft: 0
      }
    }
  }
})

class DataTableHistorico extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: this.props.data,
    page: 0,
    rowsPerPage: 5,
    open: false,
    snackbar: {
      open: false,
      variant: '',
      message: ''
    },
    loadRelatorio: false
  }

  componentWillReceiveProps ({ data }) {
    this.setState({ ...this.state, data })
  }

  gerarRelatorio = async () => {
    const { selected, data } = this.state
    if (selected.length === 0) {
      this.setState({
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Não existe data selecionada'
        }
      })
      return
    }
    this.setState({ loadRelatorio: true })

    let listaDatas = data.filter((value) => selected.includes(value.dt_liquidacao))

    try {
      const resultado = await Api.post(`recebiveis/relatorio_analitico_liquidacao/`, listaDatas)
      if (resultado.data.length <= 0) {
        this.setState({
          loadRelatorio: false,
          snackbar: {
            open: true,
            variant: 'warning',
            message: 'Ocorreu um erro ao gerar relatório'
          }
        })
        return null
      }
      exportCSVFile(resultado.data, `relatorio_liquidacao`, [])
      this.setState({
        loadRelatorio: false,
        snackbar: {
          open: true,
          variant: 'success',
          message: 'Relatório Gerado'
        }
      })
    } catch (error) {
      this.setState({
        loadRelatorio: false,
        snackbar: {
          open: true,
          variant: 'error',
          message: 'Erro no servidor'
        }
      })
    }
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
      this.setState(state => ({ selected: state.data.map((value) => value.dt_liquidacao) }))
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

  prettyNumber = number => {
    return parseFloat(number).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  render () {
    const { classes, innerLoading } = this.props
    const { data, order, orderBy, selected, rowsPerPage, page, loadRelatorio } = this.state

    return (
      <MuiThemeProvider theme={muiDatatableTheme}>
        <div className={classes.filterContainer}>
          <FilterData
            filter={this.props.filter}
            handleClick={this.props.handleClick}
            cleanFilters={this.props.cleanFilters}
            onChangeInputValue={this.props.onChangeInputValue}
            gerarRelatorio={this.gerarRelatorio}
          />
        </div>
        <Snackbar
          onClose={this.onClose}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        { innerLoading | loadRelatorio ? <Loading/> : data === null || data.length === 0
          ? <span className={classes.empytyTable}>NENHUM REGISTRO ENCONTRADO</span>
          : <Paper className={classes.root}>
            <Table className={classes.table} aria-labelledby='tableTitle'>
              <DataTableHistoricoCortesHeadComponent
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                { stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    const isSelected = this.isSelected(item.dt_liquidacao)
                    return (
                      <TableRow
                        className={classes.tableBodyRow}
                        hover
                        role='checkbox'
                        aria-checked={isSelected}
                        tabIndex={index}
                        key={index}
                      >
                        <TableCell padding='checkbox'>
                          <Checkbox
                            onClick={event => (this.handleClick(event, item.dt_liquidacao))}
                            checked={isSelected}
                          />
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.dt_liquidacao}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.qtd_ur}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.qtd_tag}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {item.ur_x_tag}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {this.prettyNumber(item.valor_ur).toLocaleString()}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {this.prettyNumber(item.valor_tag).toLocaleString()}
                        </TableCell>
                        <TableCell className={classes.cellRowStyle} align='left'>
                          {this.prettyNumber(item.ur_x_tag_valor).toLocaleString()}
                        </TableCell>
                        <TableCell align='left'>
                          {item.troca === false ? (
                            <span className={classes.falha}>Não</span>
                          ) : (
                            <span className={classes.sucesso}>Sim</span>
                          )}
                        </TableCell>
                        <TableCell align='left'>
                          {item.validado === false ? (
                            <span className={classes.falha}>Não</span>
                          ) : (
                            <IconButton className={classes.cellRowStyle}
                            ><DescriptionIcon className={classes.sucesso} />
                              <span className={classes.sucesso}>Sim</span>
                            </IconButton>
                          )}
                        </TableCell>
                        <TableCell align='left'>
                          {item.erro === false ? (
                            <span className={classes.falha}>Não</span>
                          ) : (
                            <span className={classes.sucesso}>Sim</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
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
          </Paper> }
      </MuiThemeProvider>
    )
  }
}

DataTableHistorico.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(DataTableHistorico)

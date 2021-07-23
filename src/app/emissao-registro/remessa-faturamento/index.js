import { withStyles } from '@material-ui/core/styles'
import React, { Component, Fragment } from 'react'
import DataTableRemessaxFaturamento from './components/data-table-remessaxfaturamento'
import TitlePage from '../../../components/title'
import Loading from '../../../components/loading'
import IconButton from '../../../components/buttons/IconButton'
import Snackbar from '../../../components/snackbar'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
  filterContainer: {
    [theme.breakpoints.up(960 + theme.spacing.unit * 2 * 2)]: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: 'auto',
      marginTop: theme.spacing.unit * 0
    }
  },
  dataTableContainer: {
    [theme.breakpoints.up(960 + theme.spacing.unit * 2 * 2)]: {
      marginLeft: theme.spacing.unit * 2,
      marginRight: theme.spacing.unit * 2,
      marginTop: theme.spacing.unit * 4,
      marginBottom: theme.spacing.unit * 5
    }
  },
  button: {
    [theme.breakpoints.up(10 + theme.spacing.unit * 2 * 2)]: {
      marginTop: theme.spacing.unit * 2
    }
  }
})

const INITIAL_STATE = {
  dataCard: [],
  filter: {
    dataInicial: '',
    dataFinal: ''
  },
  snackbar: {
    open: false,
    variant: '',
    message: ''
  },
  cedentesCsv: []
}

class RemessaFaturamento extends Component {
  constructor (props) {
    super(props)
    this.state = { ...INITIAL_STATE }
  }

  componentWillMount () {
    this.requestService()
  }

  updateCedentesCsv = cedentesCsv => {
    this.setState({ cedentesCsv })
  }

  requestService () {
    const data = {
      id_portador_import: this.props.location.state.id
    }

    fetch(
      `${process.env.REACT_APP_API_URL}/emissao-registro/load-grid-remessa-faturamento-divergencia`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }
    )
      .then(data => data.json())
      .then(data => {
        this.setState({ dataTable: data })
      })
      .catch(() =>
        this.setState({
          snackbar: {
            open: true,
            variant: 'error',
            message: 'Erro no servidor'
          }
        })
      )
  }

  onClose = (event, reason) => {
    if (reason === 'clickaway') {
      this.setState({ snackbar: { ...this.state.snackbar, open: false } })
    }
    this.setState({ snackbar: { ...this.state.snackbar, open: false } })
  }

  render () {
    const { classes } = this.props
    return (
      <Fragment>
        <Snackbar
          onClose={this.onClose}
          open={this.state.snackbar.open}
          variant={this.state.snackbar.variant}
          message={this.state.snackbar.message}
        />
        <TitlePage text={'Remessa x DW'} />

        <div className={classes.dataTableContainer}>
          {this.state.dataTable ? (
            <Fragment>
              <DataTableRemessaxFaturamento data={this.state.dataTable} />
              <Grid container direction='column' justify='space-around' alignItems='flex-end'>
                <IconButton
                  onClick={() => this.props.history.goBack()}
                  className={classes.button}
                  text={'Voltar'}
                  icon={<ArrowBackIcon className={classes.rightIcon} />}
                />
              </Grid>
            </Fragment>
          ) : (
            <Loading />
          )}
        </div>
      </Fragment>
    )
  }
}

export default withStyles(styles)(RemessaFaturamento)

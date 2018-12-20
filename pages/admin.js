/**
 * This is an example of a simple (read only) user dashboard. To acess this page
 * page you need to use MongoDB and set '"admin": true' on your account.
 **/
import Link from 'next/link'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomDark as SyntaxHighlighterTheme } from 'react-syntax-highlighter/dist/styles/prism';
import { Col, Row } from 'reactstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Page from '../components/page'
import Layout from '../components/layout'
import Loader from '../components/loader'
import User from '../models/user'

export default class extends Page {
  constructor(props) {
    super(props)

    this.state = {
      data: null
    }

    this.options = {
      onPageChange: this.onPageChange.bind(this),
      onSizePerPageList: this.sizePerPageListChange.bind(this),
      page: 1,
      pageStartIndex: 1,
      paginationPosition: 'top',
      paginationSize: 5,
      sizePerPage: 10,
      sizePerPageList: [ 10, 50, 100 ]
    }
  }

  async componentDidMount() {
    await this.updateData()
  }

  async onPageChange(page, sizePerPage) {
    this.options.page = page
    this.options.sizePerPage = sizePerPage
    await this.updateData()
  }

  async sizePerPageListChange(sizePerPage) {
    this.options.sizePerPage = sizePerPage
    await this.updateData()
  }

  async updateData() {
    this.setState({
      data: await User.list({
          page: this.options.page,
          size: this.options.sizePerPage
        })
    })
  }

  render() {
    if (!this.props.session.user || this.props.session.user.admin !== true)
      return super.adminAccessOnly()

    const data = (this.state.data && this.state.data.users) ? this.state.data.users : []
    const totalSize = (this.state.data && this.state.data.total) ? this.state.data.total : 0

    return (
      <Layout {...this.props} navmenu={false}>
        <h1 className="display-4">Administration</h1>
        <p className="lead text-muted ">
          This is an example read-only admin page which lists user accounts.
        </p>
        <Table
          data={data}
          totalSize={totalSize}
          options={this.options} />
      </Layout>
    )
  }
}

export class Table extends React.Component {
  render() {
    if (typeof window === 'undefined')
      return (<p>This page requires JavaScript.</p>)

    if (!this.props.data || this.props.data.length < 1)
      return (<Loader/>)

    const numberTo = (this.props.options.page * this.props.options.sizePerPage < this.props.totalSize) ? (this.props.options.page * this.props.options.sizePerPage) : this.props.totalSize
    const numberFrom = numberTo - this.props.data.length + 1
    return (
      <React.Fragment>
        <BootstrapTable pagination hover bordered={false}
          remote={true}
          data={this.props.data}
          fetchInfo={ {dataTotalSize: this.props.totalSize} }
          options={ this.props.options }>
            <TableHeaderColumn isKey dataField="_id">ID</TableHeaderColumn>
            <TableHeaderColumn dataField="name">Name</TableHeaderColumn>
            <TableHeaderColumn dataField="email">Email</TableHeaderColumn>
        </BootstrapTable>
        <p className="mt-2 text-muted text-right">
          Displaying <strong>{numberFrom}-{numberTo}</strong> of <strong>{this.props.totalSize}</strong>
        </p>
      </React.Fragment>
    )
  }
}

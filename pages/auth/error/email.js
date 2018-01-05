import Link from 'next/link'
import Page from '../../../components/page'
import Layout from '../../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session} navmenu={false}>
        <div className="text-center pt-5 pb-5">
          <h1 className="display-4">Unable to sign in</h1>
          <p className="lead">The link you tried to use to sign in was not valid.</p>
          <p className="lead"><Link href="/auth/signin"><a>Request a new sign in link.</a></Link></p>
        </div>
      </Layout>
    )
  }
}

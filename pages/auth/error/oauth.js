import Link from 'next/link'
import { Card, CardBody } from 'reactstrap'
import Page from '../../../components/page'
import Layout from '../../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session} navmenu={false}>
        <div className="text-center pt-5 pb-5">
          <h1 className="display-4">Unable to sign in</h1>
          <p className="lead">An account associated with your email address already exists.</p>
          <p className="lead"><Link href="/auth/signin"><a>Sign in with email or another service.</a></Link></p>
        </div>
        <Card className="m-5 small text-muted">
          <CardBody>
            <h4>Why am I seeing this?</h4>
            <p className="mb-0">
              To verify your identity - and prevent someone from
              hijacking your account from logging in with another service using an account with your email address - you need to first sign in here
              using your email address. Once signed in you link accounts so you can use any method to sign in.
            </p>
          </CardBody>
        </Card>
      </Layout>
    )
  }
}

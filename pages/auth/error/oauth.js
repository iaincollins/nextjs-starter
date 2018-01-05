import Link from 'next/link'
import Page from '../../../components/page'
import Layout from '../../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout session={this.props.session} navmenu={false}>
        <div className="text-center pt-5 pb-5">
          <h1 className="display-4">Unable to sign in</h1>
          <p className="lead">If you have signed up using a different service, use that method to sign in, or sign in with email.</p>
          <p className="lead"><Link href="/auth/signin"><a>Try signing in with your email address or using another service.</a></Link></p>
        </div>
        <h3 className="text-muted">Why am I seeing this?</h3>
        <p className="text-muted mb-5">
          An account associated with your email address may already exist. To verify your identity - and prevent someone from
          trying to hijack your account by signing up to another service with your email address - you need to sign in to this site
          using your email address. Once you are signed in you link accounts so you can use any method to sign in.
        </p>
      </Layout>
    )
  }
}

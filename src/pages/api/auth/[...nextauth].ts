import { query } from 'faunadb';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { fauna } from '../../../services/fauna';

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            scope: 'read:user'
        }),
    ],
    jwt: {
        signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
        verificationOptions: {
            maxTokenAge: `${2 * 60 * 60}s`, // 2 hours
            algorithms: ['HS512']
        }
    },
    callbacks: {
        async session(session) {
            try {
                const userActiveSubscription = await fauna.query(
                    query.Get(
                        query.Intersection([
                            query.Match(
                                query.Index('subscription_by_user_ref'),
                                query.Select(
                                    "ref",
                                    query.Get(
                                        query.Match(
                                            query.Index('user_by_email'),
                                            query.Casefold(session.user.email)
                                        )
                                    )
                                )
                            ),
                            query.Match(
                                query.Index('subscription_by_status'),
                                "active"
                            )
                        ])
                    )
                )

                return { ...session, activeSubscription: userActiveSubscription };
            } catch {
                return { ...session, activeSubscription: null };
            }
        },
        async signIn(user, account, profile) {
            const { email } = user;

            try {
                await fauna.query(
                    query.If(
                        query.Not(
                            query.Exists(
                                query.Match(
                                    query.Index('user_by_email'),
                                    query.Casefold(user.email)
                                )
                            )
                        ),
                        query.Create(
                            query.Collection('users'),
                            { data: { email } }
                        ),
                        query.Get(
                            query.Match(
                                query.Index('user_by_email'),
                                query.Casefold(user.email)
                            )
                        )
                    )
                )
                return true
            } catch {
                return false
            }
        }
    }
})

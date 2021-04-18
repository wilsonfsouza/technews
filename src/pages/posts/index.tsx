import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
}

interface PostsProps {
    posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
    return (
        <>
            <Head>
                <title>Posts | Technews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <Link href={`/posts/${post.slug}`}>
                            <a key={post.slug}>
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>
                    ))}
                </div>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();

    const response = await prismic.query([
        Prismic.Predicates.at('document.type', 'article')
    ], {
        fetch: ['article.title', 'article.content'],
        pageSize: 100
    })

    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        }
    })

    const ONE_DAY = 60 * 60 * 24;

    return {
        props: {
            posts
        },
        revalidate: ONE_DAY
    }
}

// When working with objects that return [Object] or [Array] (waterfall results), I can do this to see
// console.log(JSON.stringify(response, null, 2));
// null = replacer, 2 = indentation
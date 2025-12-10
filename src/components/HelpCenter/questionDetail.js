import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import useHelpCenter from '@riosst100/pwa-marketplace/src/talons/HelpCenter/useHelpCenter';
import classes from './helpcenter.module.css';

const QuestionDetail = () => {
    const { questionId } = useParams();
    const { loading, error, data } = useHelpCenter();

    const tagCounts = useMemo(() => {
        const counts = {};
        (data.questions || []).forEach(q => {
            const tags = Array.isArray(q.tags) ? q.tags : (typeof q.tags === 'string' ? q.tags.split(',') : []);
            tags.map(t => t && t.trim()).filter(Boolean).forEach(t => {
                counts[t] = (counts[t] || 0) + 1;
            });
        });
        return counts;
    }, [data.questions]);

    const question = useMemo(() => {
        const id = Number(questionId);
        return (data.questions || []).find(q => Number(q.question_id) === id) || null;
    }, [data.questions, questionId]);

    if (loading) return <div>Loading…</div>;
    if (error) return <div>We\'re sorry, an error has occurred while generating this content.</div>;
    if (!question) return <div className={classes.emptyState}>Question not found.</div>;

    return (
        <div className={classes.container}>
            <div className={classes.grid}>
                <aside className={classes.sidebar}>
                    <div className={classes.sidebarHeader}>TAGS</div>
                    <div className={classes.tagsWrap}>
                        {Object.keys(tagCounts).length === 0 && (
                            <span className={classes.emptyState}>No tags</span>
                        )}
                        {Object.entries(tagCounts).map(([tag, count]) => (
                            <Link key={tag} to={`/help-center?tag=${encodeURIComponent(tag)}`} className={`${classes.tagButton}`}>
                                {tag.toUpperCase()} ({count})
                            </Link>
                        ))}
                    </div>
                </aside>
                <main>
                    <h1 className={classes.detailTitle}>{question.title}</h1>
                    <article className={classes.questionCardDetail}>
                        <section className={classes.questionBody}>
                            {question.answer ? (
                                <div dangerouslySetInnerHTML={{ __html: question.answer }} />
                            ) : (
                                <div>We\'re sorry, an error has occurred while generating this content.</div>
                            )}
                            <div className={classes.published}>
                                <p>
                                    {question.update_time ? `on ${new Date(question.update_time).toLocaleDateString()} ` : ''}
                                    Published in: {Array.isArray(question.tags) ? (
                                        question.tags.map((t, idx) => (
                                            <Link key={idx} to={`/help-center?tag=${encodeURIComponent(t)}`} className={classes.tagLink}>{t}{idx < question.tags.length - 1 ? ', ' : ''}</Link>
                                        ))
                                    ) : (
                                        <Link to={`/help-center?tag=${encodeURIComponent(question.tags)}`} className={classes.tagLink}>{question.tags}</Link>
                                    )}
                                </p>
                            </div>
                            <div className={classes.tagsLine}>
                                <strong>Topics:</strong>
                                {Array.isArray(question.tags) ? (
                                    question.tags.map((t, idx) => (
                                        <span key={idx} className={classes.tagPill}>
                                            {String(t).toUpperCase()}
                                        </span>
                                    ))
                                ) : (
                                    <span className={classes.tagPill}>
                                        {String(question.tags).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </section>
                    </article>
                </main>
            </div>
        </div>
    );
};

export default QuestionDetail;
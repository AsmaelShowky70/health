import { Link } from 'react-router-dom';
import { articlesService } from '../services/api';
import './Articles.css';

function Articles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await articlesService.getAll();
            setArticles(response.data);
            setError(null);
        } catch (err) {
            setError('خطأ في تحميل المقالات');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">جاري تحميل المقالات...</div>;
    }

    return (
        <div className="articles-page">
            <div className="container">
                <h1 className="page-title">المقالات الطبية</h1>

                {error && <div className="alert alert-error">{error}</div>}

                {articles.length === 0 ? (
                    <div className="empty-state">
                        <h3>لا توجد مقالات حالياً</h3>
                        <p>سيتم إضافة مقالات طبية قريباً</p>
                    </div>
                ) : (
                    <div className="articles-grid">
                        {articles.map(article => (
                            <article key={article.id} className="article-card">
                                {article.image_url && (
                                    <img src={article.image_url} alt={article.title} className="article-image" />
                                )}
                                <div className="article-content">
                                    <span className="article-category">{article.category}</span>
                                    <h3>{article.title}</h3>
                                    <p className="article-excerpt">
                                        {article.content.substring(0, 150)}...
                                    </p>
                                    <div className="article-footer">
                                        <span className="article-date">
                                            {new Date(article.created_at).toLocaleDateString('ar-SA')}
                                        </span>
                                        <Link to={`/articles/${article.id}`} className="read-more">اقرأ المزيد ←</Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Articles;

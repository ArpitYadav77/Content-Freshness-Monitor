import React, { useState, useEffect } from 'react';

function App() {
    const [contents, setContents] = useState([]); // State to hold the list of contents
    const [newContent, setNewContent] = useState({
        url: '',
        title: '',
        lastUpdated: '',
        checkFrequency: 36,
        category: ''
    });

    // Fetch contents from the backend when the component loads
    useEffect(() => {
        const fetchContents = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/content');
                if (response.ok) {
                    const data = await response.json();
                    setContents(data); // Update the contents state with fetched data
                }
            } catch (error) {
                console.error('Error fetching contents:', error);
            }
        };

        fetchContents();
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewContent({
            ...newContent,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newContent)
            });

            if (response.ok) {
                const data = await response.json();
                setContents([...contents, data]); // Add the new content to the list
                // Clear form after successful submission
                setNewContent({
                    url: '',
                    title: '',
                    lastUpdated: '',
                    checkFrequency: 36,
                    category: ''
                });
            }
        } catch (error) {
            console.error('Error adding content:', error);
        }
    };

    return (
        <div className="container">
            <h1>Content Freshness Monitor</h1>

            {/* Form for adding new content */}
            <form onSubmit={handleSubmit} className="input-group">
                <input
                    type="text"
                    name="url"
                    value={newContent.url}
                    onChange={handleInputChange}
                    placeholder="URL"
                    required
                />
                <input
                    type="text"
                    name="title"
                    value={newContent.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    required
                />
                <input
                    type="date"
                    name="lastUpdated"
                    value={newContent.lastUpdated}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="number"
                    name="checkFrequency"
                    value={newContent.checkFrequency}
                    onChange={handleInputChange}
                    placeholder="Check Frequency (days)"
                    required
                />
                <input
                    type="text"
                    name="category"
                    value={newContent.category}
                    onChange={handleInputChange}
                    placeholder="Category"
                    required
                />
                <button type="submit" className="btn btn-add">Add Content</button>
            </form>

            {/* Display content list */}
            <div className="content-grid">
                {contents.length > 0 ? (
                    contents.map((content, index) => (
                        <div key={index} className="content-card">
                            <div className="content-info">
                                <h3 className="content-title">{content.title}</h3>
                                <p className="content-url">
                                    <a href={content.url} target="_blank" rel="noopener noreferrer">
                                        {content.url}
                                    </a>
                                </p>
                                <div className="content-meta">
                                    <span>Category: {content.category}</span>
                                    <span>Check Frequency: {content.checkFrequency} days</span>
                                    <span>Last Updated: {new Date(content.lastUpdated).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No content available. Add some content to display!</p>
                )}
            </div>
        </div>
    );
}

export default App;

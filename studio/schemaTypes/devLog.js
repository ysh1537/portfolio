export default {
    name: 'devLog',
    title: 'DevLog',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'date',
            title: 'Date',
            type: 'date',
        },
        {
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags'
            }
        },
        {
            name: 'summary',
            title: 'Summary',
            type: 'text',
            rows: 3
        },
        {
            name: 'content',
            title: 'Content (Markdown)',
            type: 'text',
            description: 'Write your content here using Markdown syntax.',
            rows: 20
        }
    ],
}

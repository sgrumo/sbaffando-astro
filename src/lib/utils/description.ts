import type { BlockNode } from '../models/api/strapi'

/**
 * Extracts plain text from Strapi Blocks API content
 * Recursively processes all blocks and text nodes to generate clean text
 */
export function extractTextFromBlocks(blocks: BlockNode[]): string {
    if (!blocks || blocks.length === 0) return ''

    const textParts: string[] = []

    for (const block of blocks) {
        if (block.type === 'paragraph' && block.children) {
            const paragraphText = extractTextFromNodes(block.children)
            if (paragraphText) textParts.push(paragraphText)
        } else if (block.type === 'heading' && block.children) {
            const headingText = extractTextFromNodes(block.children)
            if (headingText) textParts.push(headingText)
        } else if (block.type === 'list' && block.children) {
            const listItems = block.children
                .map(item => {
                    if (item.children) {
                        return extractTextFromNodes(item.children)
                    }
                    return ''
                })
                .filter(text => text.length > 0)
            if (listItems.length > 0) {
                textParts.push(listItems.join('. '))
            }
        } else if (block.type === 'quote' && block.children) {
            const quoteText = extractTextFromNodes(block.children)
            if (quoteText) textParts.push(quoteText)
        }
    }

    return textParts.join(' ')
}

/**
 * Recursively extracts text from text nodes
 */
function extractTextFromNodes(
    nodes: Array<{ text?: string; children?: any[] }>,
): string {
    return nodes
        .map(node => {
            if (node.text) return node.text
            if (node.children) return extractTextFromNodes(node.children)
            return ''
        })
        .join('')
}

/**
 * Creates a truncated excerpt from text
 * Respects word boundaries
 */
export function createExcerpt(text: string, maxLength: number = 155): string {
    if (!text || text.length <= maxLength) {
        return text.trim()
    }

    // Truncate to maxLength
    let truncated = text.substring(0, maxLength)

    // Find the last space to avoid cutting words
    const lastSpace = truncated.lastIndexOf(' ')
    if (lastSpace > 0) {
        truncated = truncated.substring(0, lastSpace)
    }

    // Clean up and add ellipsis
    return truncated.trim() + '...'
}

/**
 * Generates SEO-friendly description from festival
 * Falls back gracefully if no description available
 */
export function generateFestivalDescription(
    festival: any,
    maxLength: number = 155,
): string {
    // Try to extract from block content
    if (festival.description && Array.isArray(festival.description)) {
        const fullText = extractTextFromBlocks(festival.description)
        if (fullText) {
            return createExcerpt(fullText, maxLength)
        }
    }

    // Fallback to title with location
    if (festival.title && festival.address) {
        return createExcerpt(
            `${festival.title} a ${festival.address.address_line1}. Scopri date, orari e dettagli di questa sagra su Sbaffando.`,
            maxLength,
        )
    }

    // Last resort
    if (festival.title) {
        return createExcerpt(
            `${festival.title} - Scopri tutti i dettagli su Sbaffando, il portale definitivo delle sagre in Italia.`,
            maxLength,
        )
    }

    return 'Sbaffando - Il portale definitivo per le sagre in Italia'
}

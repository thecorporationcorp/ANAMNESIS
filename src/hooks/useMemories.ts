import { useCallback, useEffect } from 'react'
import { useAppStore } from '@/stores/appStore'
import { Memory } from '@/types'
import Fuse from 'fuse.js'

// Fuse.js options for fuzzy search
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.3 },
    { name: 'conversation', weight: 0.4 },
    { name: 'topic', weight: 0.2 },
    { name: 'tags', weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
  ignoreLocation: true,
}

export function useMemories() {
  const memories = useAppStore((state) => state.memories)
  const searchQuery = useAppStore((state) => state.searchQuery)
  const setSearchQuery = useAppStore((state) => state.setSearchQuery)
  const setSearchResults = useAppStore((state) => state.setSearchResults)
  const setIsSearching = useAppStore((state) => state.setIsSearching)

  // Initialize Fuse instance
  const fuse = new Fuse(memories, fuseOptions)

  // Search function
  const search = useCallback(
    (query: string) => {
      setIsSearching(true)

      if (!query.trim()) {
        setSearchResults([])
        setIsSearching(false)
        return
      }

      // Perform fuzzy search
      const results = fuse.search(query)
      const matchedMemories = results.map((r) => ({
        ...r.item,
        matchesSearch: true,
        searchScore: r.score,
      }))

      setSearchResults(matchedMemories)
      setIsSearching(false)
    },
    [fuse, setSearchResults, setIsSearching]
  )

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      search(searchQuery)
    }, 150)

    return () => clearTimeout(timer)
  }, [searchQuery, search])

  // Load memories from Electron backend
  const loadMemories = useCallback(async () => {
    try {
      const data = await window.electronAPI?.db.getMemories()
      if (data && data.length > 0) {
        useAppStore.getState().setMemories(data)
      }
    } catch (error) {
      console.error('Failed to load memories:', error)
    }
  }, [])

  // Import export file
  const importExport = useCallback(async (filePath: string) => {
    try {
      useAppStore.getState().setIsImporting(true)
      const result = await window.electronAPI?.db.importExport(filePath)

      if (result?.success) {
        await loadMemories()
      }

      return result
    } catch (error) {
      console.error('Import failed:', error)
      return { success: false, message: 'Import failed' }
    } finally {
      useAppStore.getState().setIsImporting(false)
    }
  }, [loadMemories])

  return {
    memories,
    searchQuery,
    setSearchQuery,
    search,
    loadMemories,
    importExport,
  }
}

export function useSearch() {
  const searchQuery = useAppStore((state) => state.searchQuery)
  const setSearchQuery = useAppStore((state) => state.setSearchQuery)
  const searchResults = useAppStore((state) => state.searchResults)
  const isSearching = useAppStore((state) => state.isSearching)

  return {
    query: searchQuery,
    setQuery: setSearchQuery,
    results: searchResults,
    isSearching,
  }
}

export function useCollage(memoryId: string) {
  const memories = useAppStore((state) => state.memories)
  const memory = memories.find((m) => m.id === memoryId)

  const handleContinue = useCallback(async () => {
    if (!memory) return

    // Generate SPINE seed (simplified)
    const seed = generateSpineSeed(memory)

    // Copy to clipboard
    await navigator.clipboard.writeText(seed)

    // Could also open in new tab with the seed
    console.log('SPINE seed copied to clipboard')
  }, [memory])

  const handleExport = useCallback(async () => {
    if (!memory) return

    const seed = generateSpineSeed(memory)

    // Create and download file
    const blob = new Blob([seed], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `spine-${memory.id.slice(0, 8)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [memory])

  return {
    memory,
    handleContinue,
    handleExport,
  }
}

function generateSpineSeed(memory: Memory): string {
  const lines = [
    '# SPINE SEED',
    `# Generated from: ${memory.title}`,
    `# Platform: ${memory.platform}`,
    `# Date: ${new Date(memory.timestamp).toISOString()}`,
    '',
    '## Context',
    `Topic: ${memory.topic}`,
    `Tags: ${memory.tags.join(', ')}`,
    '',
    '## Key Points',
    ...memory.userMessages.slice(0, 5).map((m) => `- ${m.slice(0, 100)}...`),
    '',
    '## Continue from here:',
    'I was working on this previously. Here is the context:',
    '',
    memory.conversation.slice(-2000),
    '',
    '---',
    'Please continue helping me with this topic.',
  ]

  return lines.join('\n')
}

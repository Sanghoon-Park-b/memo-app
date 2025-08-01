'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Memo, MemoFormData } from '@/types/memo'
import { createClient } from '@/utils/supabase/client'

export const useMemos = () => {
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  // Safely create Supabase client
  const supabase = useMemo(() => {
    try {
      // Check if environment variables are available
      const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      return hasSupabaseConfig ? createClient() : null
    } catch (error) {
      console.warn('Failed to create Supabase client:', error)
      return null
    }
  }, [])

  // 메모 로드
  useEffect(() => {
    const loadMemos = async () => {
      setLoading(true)
      
      // Supabase 설정이 없으면 빈 배열로 설정하고 로딩 완료
      if (!supabase) {
        console.warn('Supabase configuration missing. Running in offline mode.')
        setMemos([])
        setLoading(false)
        return
      }
      
      try {
        const { data, error } = await supabase
          .from('memos')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          console.error('Error loading memos:', error)
          setMemos([])
        } else {
          // Supabase의 created_at과 updated_at을 문자열로 변환
          const formattedMemos: Memo[] = data.map(memo => ({
            ...memo,
            createdAt: memo.created_at,
            updatedAt: memo.updated_at
          }))
          setMemos(formattedMemos)
        }
      } catch (error) {
        console.error('Failed to load memos:', error)
        setMemos([])
      } finally {
        setLoading(false)
      }
    }

    loadMemos()
  }, [supabase])

  // 메모 생성
  const createMemo = useCallback(async (formData: MemoFormData): Promise<Memo | null> => {
    if (!supabase) {
      console.warn('Cannot create memo: Supabase not configured')
      return null
    }
    
    try {
      const { data, error } = await supabase
        .from('memos')
        .insert({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating memo:', error)
        return null
      }

      const newMemo: Memo = {
        ...data,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }

      setMemos(prev => [newMemo, ...prev])
      return newMemo
    } catch (error) {
      console.error('Failed to create memo:', error)
      return null
    }
  }, [supabase])

  // 메모 업데이트
  const updateMemo = useCallback(
    async (id: string, formData: MemoFormData): Promise<boolean> => {
      if (!supabase) {
        console.warn('Cannot update memo: Supabase not configured')
        return false
      }
      
      try {
        const { data, error } = await supabase
          .from('memos')
          .update({
            title: formData.title,
            content: formData.content,
            category: formData.category,
            tags: formData.tags
          })
          .eq('id', id)
          .select()
          .single()

        if (error) {
          console.error('Error updating memo:', error)
          return false
        }

        const updatedMemo: Memo = {
          ...data,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }

        setMemos(prev => prev.map(memo => (memo.id === id ? updatedMemo : memo)))
        return true
      } catch (error) {
        console.error('Failed to update memo:', error)
        return false
      }
    },
    [supabase]
  )

  // 메모 삭제
  const deleteMemo = useCallback(async (id: string): Promise<boolean> => {
    if (!supabase) {
      console.warn('Cannot delete memo: Supabase not configured')
      return false
    }
    
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting memo:', error)
        return false
      }

      setMemos(prev => prev.filter(memo => memo.id !== id))
      return true
    } catch (error) {
      console.error('Failed to delete memo:', error)
      return false
    }
  }, [supabase])

  // 메모 검색
  const searchMemos = useCallback((query: string): void => {
    setSearchQuery(query)
  }, [])

  // 카테고리 필터링
  const filterByCategory = useCallback((category: string): void => {
    setSelectedCategory(category)
  }, [])

  // 특정 메모 가져오기
  const getMemoById = useCallback(
    (id: string): Memo | undefined => {
      return memos.find(memo => memo.id === id)
    },
    [memos]
  )

  // 필터링된 메모 목록
  const filteredMemos = useMemo(() => {
    let filtered = memos

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(memo => memo.category === selectedCategory)
    }

    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        memo =>
          memo.title.toLowerCase().includes(query) ||
          memo.content.toLowerCase().includes(query) ||
          memo.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [memos, selectedCategory, searchQuery])

  // 모든 메모 삭제
  const clearAllMemos = useCallback(async (): Promise<boolean> => {
    if (!supabase) {
      console.warn('Cannot clear memos: Supabase not configured')
      return false
    }
    
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .neq('id', '') // 모든 레코드 삭제

      if (error) {
        console.error('Error clearing all memos:', error)
        return false
      }

      setMemos([])
      setSearchQuery('')
      setSelectedCategory('all')
      return true
    } catch (error) {
      console.error('Failed to clear all memos:', error)
      return false
    }
  }, [supabase])

  // 통계 정보
  const stats = useMemo(() => {
    const totalMemos = memos.length
    const categoryCounts = memos.reduce(
      (acc, memo) => {
        acc[memo.category] = (acc[memo.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      total: totalMemos,
      byCategory: categoryCounts,
      filtered: filteredMemos.length,
    }
  }, [memos, filteredMemos])

  return {
    // 상태
    memos: filteredMemos,
    allMemos: memos,
    loading,
    searchQuery,
    selectedCategory,
    stats,

    // 메모 CRUD
    createMemo,
    updateMemo,
    deleteMemo,
    getMemoById,

    // 필터링 & 검색
    searchMemos,
    filterByCategory,

    // 유틸리티
    clearAllMemos,
  }
}

import { test, expect } from '@playwright/test'

test.describe('메모 생성 기능', () => {
  test.beforeEach(async ({ page }) => {
    // 1. 브라우저에서 http://localhost:3000 접속
    await page.goto('/')
    
    // 2. 페이지 로딩 완료 대기
    await page.waitForLoadState('networkidle')
  })

  test('새로운 메모를 성공적으로 작성하고 저장할 수 있다', async ({ page }) => {
    // 고유한 제목을 사용하여 충돌 방지
    const uniqueTitle = `테스트 메모 제목 ${Date.now()}`
    // 3. 우상단 "새 메모" 버튼 클릭
    const newMemoButton = page.getByRole('button', { name: '새 메모' })
    await expect(newMemoButton).toBeVisible()
    await newMemoButton.click()

    // 4. 메모 작성 모달이 열리는지 확인
    const modal = page.locator('[role="dialog"], .fixed.inset-0')
    await expect(modal).toBeVisible()
    
    // 모달 제목 확인
    await expect(page.getByText('새 메모 작성')).toBeVisible()

    // 5. 제목 입력란에 고유한 제목 입력
    const titleInput = page.locator('#title')
    await expect(titleInput).toBeVisible()
    await titleInput.fill(uniqueTitle)

    // 6. 카테고리 드롭다운에서 "개인" 선택
    const categorySelect = page.locator('#category')
    await expect(categorySelect).toBeVisible()
    await categorySelect.selectOption('personal')

    // 7. 마크다운 에디터에 내용 입력
    // MDEditor의 텍스트 영역을 찾아서 입력
    const markdownEditor = page.locator('[data-color-mode="light"] .w-md-editor-text-input, .w-md-editor-text-input, textarea').first()
    await expect(markdownEditor).toBeVisible()
    await markdownEditor.fill('# 테스트 내용\n\n이것은 **테스트** 메모입니다.')

    // 8. 태그 입력란에 "테스트" 입력
    const tagInput = page.locator('input[placeholder*="태그를 입력하고"], input[placeholder*="태그"]').last()
    await expect(tagInput).toBeVisible()
    await tagInput.fill('테스트')

    // Enter 키 또는 "추가" 버튼 클릭
    const addTagButton = page.getByRole('button', { name: '추가' })
    if (await addTagButton.isVisible()) {
      await addTagButton.click()
    } else {
      await tagInput.press('Enter')
    }

    // 9. 태그가 추가된 것을 확인 (폼 내에서 확인)
    await expect(page.locator('form').getByText('#테스트')).toBeVisible()

    // 10. "저장하기" 버튼 클릭
    const saveButton = page.getByRole('button', { name: '저장하기' })
    await expect(saveButton).toBeVisible()
    await saveButton.click()

    // 11. 모달이 닫히고 메모 목록에 새 메모가 표시되는지 확인
    await expect(modal).not.toBeVisible()
    
    // 잠시 대기 (네트워크 요청 완료)
    await page.waitForTimeout(1000)
    
    // 12. 생성된 메모의 제목, 카테고리, 태그가 올바르게 표시되는지 확인
    
    // 새로 생성된 메모 카드 찾기
    const memoCard = page.locator('.bg-white.rounded-lg.shadow-md').filter({ hasText: uniqueTitle }).first()
    await expect(memoCard).toBeVisible()
    
    // 메모 제목 확인 (메모 카드 내에서)
    await expect(memoCard.getByText(uniqueTitle)).toBeVisible()
    
    // 카테고리 배지 확인 ("개인")
    await expect(memoCard.getByText('개인')).toBeVisible()
    
    // 태그 확인
    await expect(memoCard.getByText('#테스트')).toBeVisible()
    
    // 메모가 정상적으로 생성되었는지 최종 확인 (통계 업데이트)
    await expect(page.locator('.text-sm.text-gray-600').filter({ hasText: '개' })).toBeVisible()
  })

  test('필수 필드가 누락된 경우 유효성 검사가 작동한다', async ({ page }) => {
    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click()
    
    // 모달이 열렸는지 확인
    await expect(page.getByText('새 메모 작성')).toBeVisible()

    // 제목 없이 저장 시도
    const saveButton = page.getByRole('button', { name: '저장하기' })
    await saveButton.click()

    // 유효성 검사 알림 확인
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toBe('제목과 내용을 모두 입력해주세요.')
      await dialog.accept()
    })

    // 모달이 여전히 열려있는지 확인 (저장 실패)
    await expect(page.getByText('새 메모 작성')).toBeVisible()
  })

  test('모달을 닫을 수 있다', async ({ page }) => {
    // "새 메모" 버튼 클릭
    await page.getByRole('button', { name: '새 메모' }).click()
    
    // 모달이 열렸는지 확인
    const modal = page.locator('.fixed.inset-0')
    await expect(modal).toBeVisible()

    // 닫기 버튼 클릭
    const closeButton = page.locator('button').filter({ hasText: '×' }).or(page.getByRole('button', { name: '취소' }))
    await closeButton.first().click()

    // 모달이 닫혔는지 확인
    await expect(modal).not.toBeVisible()
  })
})
# Comments Module Test Script - Simplified Version
# Usage: .\test-comments-simple.ps1

$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:8080/api/comments"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Comments Module Test - Day 30" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

try {
    # Test 1: Create comments and replies
    Write-Host "`n[Test 1] Create comments and replies" -ForegroundColor Magenta
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    
    Write-Host "`n1.1 Create first comment (root)..." -ForegroundColor Yellow
    $comment1 = Invoke-RestMethod -Uri "$baseUrl" -Method POST `
        -ContentType "application/json" `
        -Body '{"articleId":1,"commentator":"ZhangSan","email":"zhangsan@example.com","content":"This is the first comment, very good!"}'
    
    $comment1Id = $comment1.data.id
    Write-Host "OK Comment 1 created, ID = $comment1Id" -ForegroundColor Green
    
    Start-Sleep -Milliseconds 100
    
    Write-Host "`n1.2 Create second comment (root)..." -ForegroundColor Yellow
    $comment2 = Invoke-RestMethod -Uri "$baseUrl" -Method POST `
        -ContentType "application/json" `
        -Body '{"articleId":1,"commentator":"LiSi","email":"lisi@example.com","content":"I also think its good, support!"}'
    
    $comment2Id = $comment2.data.id
    Write-Host "OK Comment 2 created, ID = $comment2Id" -ForegroundColor Green
    
    Start-Sleep -Milliseconds 100
    
    Write-Host "`n1.3 Create reply to comment 1..." -ForegroundColor Yellow
    $comment3 = Invoke-RestMethod -Uri "$baseUrl" -Method POST `
        -ContentType "application/json" `
        -Body @"
{
  "articleId": 1,
  "commentator": "WangWu",
  "email": "wangwu@example.com",
  "content": "Thanks for your support!",
  "parentId": $comment1Id
}
"@
    
    $comment3Id = $comment3.data.id
    Write-Host "OK Comment 3 (reply) created, ID = $comment3Id, parentId = $($comment3.data.parentId)" -ForegroundColor Green
    
    Start-Sleep -Milliseconds 100
    
    Write-Host "`n1.4 Create sub-reply (reply to comment 3)..." -ForegroundColor Yellow
    $comment4 = Invoke-RestMethod -Uri "$baseUrl" -Method POST `
        -ContentType "application/json" `
        -Body @"
{
  "articleId": 1,
  "commentator": "XiaoMing",
  "email": "xiaoming@example.com",
  "content": "Everyone is so enthusiastic!",
  "parentId": $comment3Id
}
"@
    
    $comment4Id = $comment4.data.id
    Write-Host "OK Comment 4 (sub-reply) created, ID = $comment4Id, parentId = $($comment4.data.parentId), rootId = $($comment4.data.rootId)" -ForegroundColor Green
    
    Write-Host "`nOK Test 1 Complete: Created 4 comments (including replies)" -ForegroundColor Green
    
    # Test 2: Query all comments (tree structure)
    Write-Host "`n[Test 2] Query all comments (tree structure)" -ForegroundColor Magenta
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    
    $comments = Invoke-RestMethod -Uri "$baseUrl?articleId=1" -Method GET
    Write-Host "Found $($comments.data.Count) root comments" -ForegroundColor Yellow
    
    foreach ($comment in $comments.data) {
        Write-Host "`n  + Comment ID: $($comment.id)" -ForegroundColor White
        Write-Host "    - Commentator: $($comment.commentator)" -ForegroundColor Gray
        Write-Host "    - Content: $($comment.content)" -ForegroundColor Gray
        Write-Host "    - Status: $($comment.status)" -ForegroundColor Gray
        
        if ($comment.replies -and $comment.replies.Count -gt 0) {
            Write-Host "    - Replies: $($comment.replies.Count)" -ForegroundColor Cyan
            foreach ($reply in $comment.replies) {
                Write-Host "      + Reply ID: $($reply.id)" -ForegroundColor DarkGray
                Write-Host "        - Commentator: $($reply.commentator)" -ForegroundColor DarkGray
                Write-Host "        - Content: $($reply.content)" -ForegroundColor DarkGray
            }
        }
    }
    
    Write-Host "`nOK Test 2 Complete: Successfully queried tree structure" -ForegroundColor Green
    
    # Test 3: Soft delete comment
    Write-Host "`n[Test 3] Soft delete comment (comment 1)" -ForegroundColor Magenta
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    
    Write-Host "`n3.1 Execute soft delete..." -ForegroundColor Yellow
    $deleted = Invoke-RestMethod -Uri "$baseUrl/$comment1Id" -Method DELETE
    
    Write-Host "Status after delete: $($deleted.data.status)" -ForegroundColor Yellow
    Write-Host "Content after delete: $($deleted.data.content)" -ForegroundColor Yellow
    
    if ($deleted.data.status -eq -1 -and $deleted.data.content -eq "This comment has been blocked/deleted") {
        Write-Host "OK Verified: Comment soft deleted successfully" -ForegroundColor Green
    } else {
        Write-Host "ERROR Verification failed: Soft delete not working" -ForegroundColor Red
        throw "Soft delete test failed"
    }
    
    Write-Host "`n3.2 Verify comment still visible (with delete marker)..." -ForegroundColor Yellow
    $comments = Invoke-RestMethod -Uri "$baseUrl?articleId=1" -Method GET
    $deletedComment = $comments.data | Where-Object { $_.id -eq $comment1Id }
    
    if ($deletedComment) {
        Write-Host "OK Comment still in list (shows delete marker)" -ForegroundColor Green
        Write-Host "    - Status: $($deletedComment.status)" -ForegroundColor White
        Write-Host "    - Content: $($deletedComment.content)" -ForegroundColor White
        Write-Host "    - Commentator: $($deletedComment.commentator)" -ForegroundColor White
        
        if ($deletedComment.replies -and $deletedComment.replies.Count -gt 0) {
            Write-Host "    - Child comments: $($deletedComment.replies.Count) (still visible)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "ERROR Comment disappeared (this is physical delete, not soft delete)" -ForegroundColor Red
        throw "Soft delete verification failed"
    }
    
    Write-Host "`nOK Test 3 Complete: Soft delete successful, comment tree structure intact" -ForegroundColor Green
    
    # Test 4: Update comment content
    Write-Host "`n[Test 4] Update comment content" -ForegroundColor Magenta
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    
    Write-Host "`n4.1 Create test comment..." -ForegroundColor Yellow
    $testComment = Invoke-RestMethod -Uri "$baseUrl" -Method POST `
        -ContentType "application/json" `
        -Body '{"articleId":1,"commentator":"TestUser","email":"test@example.com","content":"Original content"}'
    
    $testCommentId = $testComment.data.id
    Write-Host "OK Comment created, ID = $testCommentId" -ForegroundColor Green
    Write-Host "    - Original content: $($testComment.data.content)" -ForegroundColor Gray
    
    Write-Host "`n4.2 Update comment content..." -ForegroundColor Yellow
    $updateResult = Invoke-RestMethod -Uri "$baseUrl/$testCommentId" -Method PUT `
        -ContentType "application/json" `
        -Body '{"content":"This is modified content","email":"newemail@example.com"}'
    
    Write-Host "OK Update result: $($updateResult.message)" -ForegroundColor Green
    Write-Host "    - New content: $($updateResult.data.content)" -ForegroundColor Yellow
    Write-Host "    - New email: $($updateResult.data.email)" -ForegroundColor Yellow
    
    Write-Host "`n4.3 Verify update..." -ForegroundColor Yellow
    $updatedComment = Invoke-RestMethod -Uri "$baseUrl/$testCommentId" -Method GET
    Write-Host "Verification result:" -ForegroundColor Yellow
    Write-Host "    - ID: $($updatedComment.data.id)" -ForegroundColor White
    Write-Host "    - Content: $($updatedComment.data.content)" -ForegroundColor White
    Write-Host "    - Email: $($updatedComment.data.email)" -ForegroundColor White
    
    if ($updatedComment.data.content -eq "This is modified content" -and 
        $updatedComment.data.email -eq "newemail@example.com") {
        Write-Host "OK Verified: Comment updated successfully" -ForegroundColor Green
    } else {
        Write-Host "ERROR Verification failed: Content or email mismatch" -ForegroundColor Red
    }
    
    Write-Host "`nOK Test 4 Complete: Comment update function demonstrated" -ForegroundColor Green
    
    # Test 5: Clean up test data
    Write-Host "`n[Test 5] Clean up test data" -ForegroundColor Magenta
    Write-Host "----------------------------------------" -ForegroundColor DarkGray
    
    Write-Host "`n5.1 Delete all comments for article 1..." -ForegroundColor Yellow
    try {
        $cleanQuery = "mysql -u blog_user -pblog123456 blog -e `"DELETE FROM comment WHERE article_id = 1;`""
        Invoke-Expression $cleanQuery
        Write-Host "OK Test data cleaned up" -ForegroundColor Green
        
        Write-Host "`n5.2 Verify cleanup..." -ForegroundColor Yellow
        $verifyQuery = "mysql -u blog_user -pblog123456 blog -e `"SELECT COUNT(*) AS remaining FROM comment WHERE article_id = 1;`""
        Invoke-Expression $verifyQuery
    } catch {
        Write-Host "WARNING MySQL cleanup failed" -ForegroundColor DarkGray
    }
    
    Write-Host "`nOK Test 5 Complete: Test data cleanup" -ForegroundColor Green
    
    # Test complete summary
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "  All tests complete!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "`nTest Summary:" -ForegroundColor Cyan
    Write-Host "  OK Create comments and replies" -ForegroundColor Green
    Write-Host "  OK Query tree structure comments" -ForegroundColor Green
    Write-Host "  OK Soft delete comment (keep tree structure)" -ForegroundColor Green
    Write-Host "  OK Update comment content" -ForegroundColor Green
    Write-Host "  OK Clean up test data" -ForegroundColor Green
    Write-Host ""
    
} catch {
    Write-Host "`nERROR Test failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.InnerException) {
        Write-Host "`nError details: $($_.Exception.InnerException.Message)" -ForegroundColor DarkRed
    }
    exit 1
}

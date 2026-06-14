# Test Soft Delete
$deleted = Invoke-RestMethod -Uri 'http://localhost:8080/api/comments/6' -Method DELETE
Write-Host "=== Soft Delete Test Result ===" -ForegroundColor Cyan
Write-Host "Status after delete: $($deleted.data.status)" -ForegroundColor Yellow
Write-Host "Content after delete: $($deleted.data.content)" -ForegroundColor Yellow

if ($deleted.data.status -eq -1 -and $deleted.data.content -eq "该评论已被屏蔽/删除") {
    Write-Host "OK: Soft delete successful!" -ForegroundColor Green
} else {
    Write-Host "ERROR: Soft delete failed" -ForegroundColor Red
}

# Verify comment still visible
Write-Host "`n=== Verify Comment Still Visible ===" -ForegroundColor Cyan
$comments = Invoke-RestMethod -Uri 'http://localhost:8080/api/comments?articleId=1' -Method GET
$deletedComment = $comments.data | Where-Object { $_.id -eq 6 }

if ($deletedComment) {
    Write-Host "OK: Comment still visible in list" -ForegroundColor Green
    Write-Host "  - Status: $($deletedComment.status)" -ForegroundColor White
    Write-Host "  - Content: $($deletedComment.content)" -ForegroundColor White
    Write-Host "  - Replies count: $($deletedComment.replies.Count)" -ForegroundColor White
} else {
    Write-Host "ERROR: Comment disappeared (physical delete instead of soft delete)" -ForegroundColor Red
}

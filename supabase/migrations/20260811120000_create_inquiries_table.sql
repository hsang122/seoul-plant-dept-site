-- 해외플랜트산업설비과 홈페이지: 문의하기 폼 저장용 테이블
-- 이 마이그레이션은 Supabase 대시보드 SQL Editor에서 2026-08-11에 이미 수동으로 적용되었습니다.
-- (이 파일은 그 변경 이력을 기록/추적하기 위한 것으로, 같은 프로젝트 DB에 다시 실행할 필요는 없습니다.)

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- 행 수준 보안(RLS) 활성화
alter table public.inquiries enable row level security;

-- 누구나(anon 공개키) 새 문의를 "추가"만 할 수 있도록 허용
-- (읽기/수정/삭제는 허용하지 않음 -> 다른 사람이 제출한 문의를 볼 수 없음)
drop policy if exists "Allow public insert on inquiries" on public.inquiries;
create policy "Allow public insert on inquiries"
  on public.inquiries
  for insert
  to anon
  with check (true);

-- 관리자(선생님)가 문의 내역을 확인하려면 Supabase 대시보드의
-- Table Editor에서 inquiries 테이블을 직접 열어보시면 됩니다.
-- (RLS 정책상 웹사이트에서는 목록을 조회할 수 없고, 대시보드는 서비스 권한으로 우회됩니다.)

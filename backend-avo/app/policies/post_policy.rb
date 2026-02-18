class PostPolicy < ApplicationPolicy
  def update?
    true # 所有人都能看到 Post 的按鈕
  end

  def show?
    true
  end
end
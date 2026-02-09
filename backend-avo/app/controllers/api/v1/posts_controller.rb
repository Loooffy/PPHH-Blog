class Api::V1::PostsController < Api::BaseController
  def index
    # 只顯示已發布的文章
    @posts = Post.where(status: 'published')
    
    # 根據 layout_type 過濾
    if params[:layout_type].present?
      @posts = @posts.where(layout_type: params[:layout_type])
    end
    
    # 根據 category 過濾（如果需要的話）
    if params[:category].present?
      @posts = @posts.where(category: params[:category])
    end
    
    render json: @posts
  end

  def show
    # 支持通過 ID 或 slug 查找文章
    id_or_slug = params[:id]
    
    # 嘗試作為 ID 查找（數字）
    if id_or_slug.to_i.to_s == id_or_slug
      @post = Post.where(status: 'published').find_by(id: id_or_slug)
    else
      # 作為 slug 查找
      @post = Post.where(status: 'published').find_by(slug: id_or_slug)
    end
    
    if @post
      render json: @post
    else
      render json: { error: 'Post not found' }, status: :not_found
    end
  end
end

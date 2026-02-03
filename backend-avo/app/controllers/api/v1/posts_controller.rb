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
    @post = Post.where(status: 'published').find(params[:id])
    render json: @post
  end
end

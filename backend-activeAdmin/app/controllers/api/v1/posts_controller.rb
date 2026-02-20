# frozen_string_literal: true

module Api
  module V1
    class PostsController < BaseController
      before_action :set_post, only: [:show]

      def index
        @posts = Post.where(status: "published")
                    .where("published_at <= ?", Time.current)
                    .order(published_at: :desc)

        @posts = @posts.where(type: params[:type]) if params[:type].present?
        @posts = @posts.joins(:tags).where(tags: { id: params[:tag_id] }).distinct if params[:tag_id].present?

        @posts = @posts.page(params[:page]).per(params[:per_page] || 20)
      end

      def show
        if @post.blank? || @post.status != "published" ||
           @post.published_at.blank? || @post.published_at > Time.current
          return render json: { error: "Not found" }, status: :not_found
        end
      end

      private

      def set_post
        @post = Post.find_by(slug: params[:slug])
      end
    end
  end
end

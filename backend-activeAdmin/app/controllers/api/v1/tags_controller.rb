# frozen_string_literal: true

module Api
  module V1
    class TagsController < BaseController
      def index
        @tags = Tag.includes(:post_type).order(:name)
        @tags = @tags.joins(:post_type).where(post_types: { name: params[:type] }) if params[:type].present?
      end
    end
  end
end

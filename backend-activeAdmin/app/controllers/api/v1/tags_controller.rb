# frozen_string_literal: true

module Api
  module V1
    class TagsController < BaseController
      def index
        @tags = Tag.all.order(:name)
      end
    end
  end
end
